const pool = require("../db");

const createTransactionItemsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS transaction_items (
        id SERIAL PRIMARY KEY,
        transaction_id INTEGER REFERENCES transactions(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);
    console.log("Transaction items table created successfully");
  } catch (error) {
    console.error("Error creating transaction items table:", error);
  } finally {
    client.release();
  }
};

module.exports = createTransactionItemsTable;
