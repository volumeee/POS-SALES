const pool = require("../db");

const createTransactionsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Transactions table created successfully");
  } catch (error) {
    console.error("Error creating transactions table:", error);
  } finally {
    client.release();
  }
};

module.exports = createTransactionsTable;
