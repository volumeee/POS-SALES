import { createSlice } from "@reduxjs/toolkit";
import { fetchCustomerDetail } from "./customersSlice";
// import { fetchProductDetail } from "./productsSlice";
// import { fetchTransactionDetail } from "./transactionsSlice";

const initialState = {
  breadcrumbs: {},
};

const breadcrumbsSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    updateBreadcrumbs: (state, action) => {
      const pathSnippets = action.payload;

      // Default breadcrumbs based on URL segments
      pathSnippets.forEach((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
        if (!state.breadcrumbs[url]) {
          state.breadcrumbs[url] = { name: snippet };
        }
      });
    },
    setBreadcrumb: (state, action) => {
      const { url, name } = action.payload;
      state.breadcrumbs[url] = { name };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomerDetail.fulfilled, (state, action) => {
      const customer = action.payload;
      const url = `/customers/${customer.id}`;
      state.breadcrumbs[url] = { name: customer.name };
    });
    // .addCase(fetchProductDetail.fulfilled, (state, action) => {
    //   const product = action.payload;
    //   const url = `/products/${product.id}`;
    //   state.breadcrumbs[url] = { name: product.name };
    // })
    // .addCase(fetchTransactionDetail.fulfilled, (state, action) => {
    //   const transaction = action.payload;
    //   const url = `/transactions/${transaction.id}`;
    //   state.breadcrumbs[url] = { name: transaction.reference };
    // });
  },
});

export const { updateBreadcrumbs, setBreadcrumb } = breadcrumbsSlice.actions;

export default breadcrumbsSlice.reducer;
