const pool = require("../db");

const seedCustomers = async () => {
  const client = await pool.connect();
  try {
    const customers = [];

    // Generate 100 customers
    for (let i = 1; i <= 100; i++) {
      customers.push({
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `123-456-789${i % 10}`, // Example phone number format
        address: `Address ${i}`,
      });
    }

    // Insert each customer into the customers table
    for (const customer of customers) {
      await client.query(
        "INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4)",
        [customer.name, customer.email, customer.phone, customer.address]
      );
    }

    console.log("Customers seeded successfully");
  } catch (error) {
    console.error("Error seeding customers:", error);
  } finally {
    client.release();
  }
};

seedCustomers();
