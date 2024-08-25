import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "../features/customersSlice";
import productsReducer from "../features/productSlice";
import transactionReducer from "../features/transactionSlice";
import breadcrumbReducer from "../features/breadCrumbSlice";

const store = configureStore({
  reducer: {
    customers: customersReducer,
    products: productsReducer,
    transaction: transactionReducer,
    breadcrumbs: breadcrumbReducer,
  },
});

export default store;
