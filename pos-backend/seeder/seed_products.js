const pool = require("../db");

const seedProducts = async () => {
  const client = await pool.connect();
  try {
    const products = [
      { name: "Product 1", price: 10000, stock: 100 },
      { name: "Product 2", price: 2000, stock: 75 },
      { name: "Product 3", price: 100000, stock: 50 },
      { name: "Product 4", price: 50000, stock: 25 },
      { name: "Product 5", price: 70000, stock: 10 },
      { name: "Product 6", price: 5000, stock: 15 },
      { name: "Product 7", price: 3000, stock: 20 },
      { name: "Product 8", price: 4000, stock: 30 },
      { name: "Product 9", price: 50000, stock: 40 },
      { name: "Product 10", price: 5500, stock: 50 },
    ];

    for (const product of products) {
      await client.query(
        "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3)",
        [product.name, product.price, product.stock]
      );
    }

    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    client.release();
  }
};

seedProducts();
