const createProductsTable = require("../migrations/create_products_table");
const createCustomersTable = require("../migrations/create_customers_table");
const createTransactionsTable = require("../migrations/create_transactions_table");
const createTransactionItemsTable = require("../migrations/create_transaction_items_table");

const runMigrations = async () => {
  await createProductsTable();
  await createCustomersTable();
  await createTransactionsTable();
  await createTransactionItemsTable();
  console.log("All migrations completed");
  process.exit(0);
};

runMigrations();
