const express = require("express");
const router = express.Router();
const pool = require("../db");

//get all products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at desc, updated_at desc"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

//get a single products
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
});

//add new products
router.post("/", async (req, res) => {
  const { name, price, stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *",
      [name, price, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
});

//update products
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, stock = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [name, price, stock, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
});

//delete products
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Delete related transaction items
    await client.query("DELETE FROM transaction_items WHERE product_id = $1", [
      id,
    ]);

    // Delete the product
    const result = await client.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Product not found" });
    }

    await client.query("COMMIT");
    res.json({ message: "Product and related items deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting product and related items:", error);
    res.status(500).json({ error: "Error deleting product and related items" });
  } finally {
    client.release();
  }
});

module.exports = router;
