import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TRANSACTIONS_URL } from "../api";

// Thunks for async operations
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    const response = await axios.get(TRANSACTIONS_URL);
    return response.data;
  }
);

export const fetchTransactionDetail = createAsyncThunk(
  "transactions/fetchTransactionDetail",
  async (id) => {
    const response = await axios.get(`${TRANSACTIONS_URL}/${id}`);
    return response.data;
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (newTransaction) => {
    const response = await axios.post(TRANSACTIONS_URL, newTransaction);
    return response.data;
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (updatedTransaction) => {
    const { id, ...data } = updatedTransaction;
    const response = await axios.patch(`${TRANSACTIONS_URL}/${id}`, data);
    return response.data;
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id) => {
    await axios.delete(`${TRANSACTIONS_URL}/${id}`);
    return id;
  }
);

export const updateTransactionPaymentStatus = createAsyncThunk(
  "transactions/updateTransactionPaymentStatus",
  async ({ id, paymentStatus }) => {
    const response = await axios.patch(`${TRANSACTIONS_URL}/payment/${id}`, {
      payment_status: paymentStatus,
    });
    return response.data;
  }
);

// Initial state
const initialState = {
  transactions: [],
  transactionDetail: null,
  status: "idle",
  error: null,
};

// Slice creation
const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactionDetail: (state) => {
      state.transactionDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchTransactionDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactionDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactionDetail = action.payload;
      })
      .addCase(fetchTransactionDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
      })
      .addCase(updateTransactionPaymentStatus.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      });
  },
});

export const { clearTransactionDetail } = transactionsSlice.actions;
export default transactionsSlice.reducer;
