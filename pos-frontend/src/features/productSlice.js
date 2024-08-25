import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PRODUCTS_URL } from "../api";

// Thunks for async operations
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(PRODUCTS_URL);
    return response.data;
  }
);

export const fetchProductDetail = createAsyncThunk(
  "products/fetchProductDetail",
  async (id) => {
    const response = await axios.get(`${PRODUCTS_URL}/${id}`);
    return response.data;
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (newProduct) => {
    console.log("Adding product:", newProduct); // Debugging
    const response = await axios.post(PRODUCTS_URL, newProduct);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (updatedProduct) => {
    const { id, ...data } = updatedProduct;
    console.log("Updating product:", updatedProduct); // Debugging
    const response = await axios.put(`${PRODUCTS_URL}/${id}`, data);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    console.log("Deleting product:", id);
    await axios.delete(`${PRODUCTS_URL}/${id}`);
    return id;
  }
);

// Initial state
const initialState = {
  products: [],
  productDetail: null,
  status: "idle", // idle, loading, succeeded, failed
  error: null,
};

// Slice creation
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductDetail: (state) => {
      state.productDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productDetail = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      });
  },
});

export const { clearProductDetail } = productsSlice.actions;
export default productsSlice.reducer;
