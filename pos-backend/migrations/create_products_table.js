const pool = require("../db");

const createProductTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
  } catch (error) {
    console.log("error in creating product table :", error);
  } finally {
    client.release();
  }
};

module.exports = createProductTable;
