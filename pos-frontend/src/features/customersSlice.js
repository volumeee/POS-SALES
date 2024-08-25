import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CUSTOMERS_URL } from "../api";

// Thunks for async operations
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async () => {
    const response = await axios.get(CUSTOMERS_URL);
    console.log(response.data);
    return response.data;
  }
);

export const fetchCustomerDetail = createAsyncThunk(
  "customers/fetchCustomerDetail",
  async (id) => {
    const response = await axios.get(`${CUSTOMERS_URL}/${id}`);
    return response.data;
  }
);

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (newCustomer) => {
    const response = await axios.post(CUSTOMERS_URL, newCustomer);
    return response.data;
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async (updatedCustomer) => {
    const { id, ...data } = updatedCustomer;
    const response = await axios.patch(`${CUSTOMERS_URL}/${id}`, data);
    return response.data;
  }
);

export const updateCustomerProduct = createAsyncThunk(
  "customers/updateCustomerProduct",
  async ({ customerId, transactionItemId, quantity, newProductId }) => {
    const response = await axios.put(
      `${CUSTOMERS_URL}/${customerId}/transaction/${transactionItemId}`,
      {
        quantity,
        newProductId,
      }
    );
    return response.data;
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id) => {
    await axios.delete(`${CUSTOMERS_URL}/hard/${id}`);
    return id;
  }
);

export const activateCustomer = createAsyncThunk(
  "customers/activateCustomer",
  async (id) => {
    const response = await axios.patch(`${CUSTOMERS_URL}/activate/${id}`);
    return response.data;
  }
);

export const deactivateCustomer = createAsyncThunk(
  "customers/deactivateCustomer",
  async (id) => {
    const response = await axios.delete(`${CUSTOMERS_URL}/deactivate/${id}`);
    return response.data;
  }
);

// Initial state
const initialState = {
  customers: [],
  customerDetail: null,
  status: "idle", // idle, loading, succeeded, failed
  error: null,
};

// Slice creation
const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCustomerDetail: (state) => {
      state.customerDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCustomerDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomerDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customerDetail = action.payload;
      })
      .addCase(fetchCustomerDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (customer) => customer.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomerProduct.fulfilled, (state, action) => {
        if (state.customerDetail) {
          const transaction = state.customerDetail.transactions.find((t) =>
            t.items.some(
              (item) =>
                item.transaction_item_id === action.payload.transaction_item_id
            )
          );

          if (transaction) {
            const item = transaction.items.find(
              (item) =>
                item.transaction_item_id === action.payload.transaction_item_id
            );

            if (item) {
              item.quantity = action.payload.quantity;
              item.product_id = action.payload.newProductId;
            }

            transaction.total_amount =
              action.payload.total_amount || transaction.total_amount;
          }
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (customer) => customer.id !== action.payload
        );
      })
      .addCase(activateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (customer) => customer.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(deactivateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (customer) => customer.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      });
  },
});

export const { clearCustomerDetail } = customersSlice.actions;
export default customersSlice.reducer;
