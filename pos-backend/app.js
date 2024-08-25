const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const customersRouter = require("./routes/customers");
const transactionsRouter = require("./routes/transactions");
const productsRouter = require("./routes/products");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//routes
app.use("/api/customers", customersRouter);
app.use("/api/products", productsRouter);
app.use("/api/transactions", transactionsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
