const express = require("express");
const router = express.Router();
const pool = require("../db");

//get all customers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customers" });
  }
});

//add new customers
router.post("/", async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error adding customer" });
  }
});

//get customers details
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Get customer details
    const customerResult = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );
    if (customerResult.rows.length === 0) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    // Get transactions for the customer
    const transactionsResult = await pool.query(
      `
      SELECT t.id as transaction_id, t.total_amount, t.updated_at, t.payment_status, t.created_at,
             ti.id as transaction_item_id, ti.product_id, p.name as product_name, ti.quantity, p.price
      FROM transactions t
      JOIN transaction_items ti ON t.id = ti.transaction_id
      JOIN products p ON ti.product_id = p.id
      WHERE t.customer_id = $1
    `,
      [id]
    );

    // Aggregate transaction data
    const transactions = transactionsResult.rows.reduce((acc, row) => {
      if (!acc[row.transaction_id]) {
        acc[row.transaction_id] = {
          id: row.transaction_id,
          total_amount: row.total_amount,
          payment_status: row.payment_status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: [],
        };
      }
      acc[row.transaction_id].items.push({
        transaction_item_id: row.transaction_item_id, // Added this line
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price,
      });
      return acc;
    }, {});

    // Combine customer details with transactions
    const customer = customerResult.rows[0];
    customer.transactions = Object.values(transactions);

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error getting customer details" });
  }
});

//update customers details
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  try {
    const result = await pool.query(
      "UPDATE customers SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5 RETURNING *",
      [name, email, phone, address, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error updating customer" });
  }
});

//update customers products
router.put("/:customerId/transaction/:transactionItemId", async (req, res) => {
  const { customerId, transactionItemId } = req.params;
  const { quantity, newProductId } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get the current transaction item before updating it
    const currentItemQuery = `
      SELECT product_id, quantity
      FROM transaction_items
      WHERE id = $1
    `;
    const currentItemResult = await client.query(currentItemQuery, [
      transactionItemId,
    ]);

    if (currentItemResult.rows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ error: "Transaction item not found" });
      return;
    }

    const currentProductId = currentItemResult.rows[0].product_id;
    const updatedProductId = newProductId || currentProductId;

    // Get the correct price for the product
    const priceQuery = `
      SELECT price
      FROM products
      WHERE id = $1
    `;
    const priceResult = await client.query(priceQuery, [updatedProductId]);
    const price = priceResult.rows[0].price;

    // Update the specific product and quantity in transaction_items
    const updateItemsQuery = `
      UPDATE transaction_items
      SET 
        quantity = COALESCE($1, quantity),
        product_id = COALESCE($2, product_id),
        price = $3
      WHERE id = $4
      AND EXISTS (
        SELECT 1 FROM transactions t
        WHERE t.id = transaction_id
        AND t.customer_id = $5
      )
      RETURNING transaction_id
    `;

    const itemsResult = await client.query(updateItemsQuery, [
      quantity,
      newProductId,
      price, // Use the correct price from the product table
      transactionItemId,
      customerId,
    ]);

    if (itemsResult.rows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ error: "Customer or product not found" });
      return;
    }

    // Get the transaction_id from the updated item
    const transactionId = itemsResult.rows[0].transaction_id;

    // Recalculate the total amount for the transaction by summing up all relevant items
    const totalAmountQuery = `
      SELECT SUM(ti.quantity * ti.price) AS total_amount
      FROM transaction_items ti
      WHERE ti.transaction_id = $1
    `;

    const totalAmountResult = await client.query(totalAmountQuery, [
      transactionId,
    ]);

    const totalAmount = totalAmountResult.rows[0].total_amount;

    // Update the transaction with the new total amount and timestamp
    await client.query(
      "UPDATE transactions SET total_amount = $1, updated_at = NOW() WHERE id = $2",
      [totalAmount, transactionId]
    );

    await client.query("COMMIT");

    res.json({
      message: "Product and quantity updated successfully",
      updatedTransaction: {
        transaction_id: transactionId,
        total_amount: totalAmount,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating transaction item:", error.message);
    res
      .status(500)
      .json({ error: "Error updating customer product and quantity" });
  } finally {
    client.release();
  }
});

// Hard delete a customer
router.delete("/hard/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customerResult = await pool.query(
      "DELETE FROM customers WHERE id = $1 RETURNING *",
      [id]
    );
    if (customerResult.rows.length === 0) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json({
      message: "Customer deleted successfully",
      customer: customerResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customer" });
  }
});

// Soft delete a customer
router.delete("/deactivate/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customerResult = await pool.query(
      "UPDATE customers SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );
    if (customerResult.rows.length === 0) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json({
      message: "Customer deleted successfully",
      customer: customerResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customer" });
  }
});

// Soft undelete a customer
router.patch("/activate/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customerResult = await pool.query(
      "UPDATE customers SET deleted_at = NULL WHERE id = $1 RETURNING *",
      [id]
    );
    if (customerResult.rows.length === 0) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json({
      message: "Customer undeleted successfully",
      customer: customerResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Error undeleting customer" });
  }
});

module.exports = router;
