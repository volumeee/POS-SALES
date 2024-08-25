const express = require("express");
const router = express.Router();
const pool = require("../db");

//create a new transaction
router.post("/", async (req, res) => {
  const { customerId, items, payment_status = "PENDING" } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if the customer exists
    const customerResult = await client.query(
      "SELECT id FROM customers WHERE id = $1",
      [customerId]
    );

    if (customerResult.rows.length === 0) {
      throw new Error(`Customer with ID ${customerId} does not exist`);
    }

    // Create the transaction
    const transactionResult = await client.query(
      "INSERT INTO transactions (customer_id, total_amount, payment_status) VALUES ($1, $2, $3) RETURNING id",
      [customerId, 0, payment_status]
    );
    const transactionId = transactionResult.rows[0].id;
    let totalAmount = 0;

    // Add transaction items and calculate the total amount
    for (const item of items) {
      const { productId, quantity } = item;

      // Check if the product exists
      const productResult = await client.query(
        "SELECT price FROM products WHERE id = $1",
        [productId]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product with ID ${productId} does not exist`);
      }

      const price = productResult.rows[0].price;
      const itemTotal = price * quantity;

      await client.query(
        "INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [transactionId, productId, quantity, price]
      );

      totalAmount += itemTotal;
    }

    // Update the transaction with the calculated total amount
    await client.query(
      "UPDATE transactions SET total_amount = $1 WHERE id = $2",
      [totalAmount, transactionId]
    );

    await client.query("COMMIT");

    // Respond with the transaction details
    res.status(201).json({
      id: transactionId,
      total: totalAmount,
      status: payment_status,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating transaction:", error.message);
    res.status(500).json({ error: "Error creating transaction" });
  } finally {
    client.release();
  }
});

//get all transactions
// Get all transactions with transaction items and customer names
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id, 
        t.customer_id, 
        c.name AS customer_name, 
        t.total_amount, 
        t.payment_status, 
        t.created_at, 
        t.updated_at,
        json_agg(
          json_build_object(
            'id', ti.id,
            'product_id', ti.product_id,
            'quantity', ti.quantity,
            'price', ti.price
          )
        ) AS items
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      GROUP BY t.id, c.name
      ORDER BY t.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

//get single transaction
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transactionResult = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );
    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    const itemsResult = await pool.query(
      "SELECT * FROM transaction_items WHERE transaction_id = $1",
      [id]
    );

    // res.json({ ...transactionResult.rows[0], items: itemsResult.rows });
    const transaction = transactionResult.rows[0];
    transaction.items = itemsResult.rows;

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transaction" });
  }
});

// Update transaction payment status
router.patch("/payment/:id", async (req, res) => {
  const { id } = req.params;
  const { payment_status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE transactions SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [payment_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating transaction payment status" });
  }
});

module.exports = router;
