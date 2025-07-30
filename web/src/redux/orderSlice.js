import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl";
// Base URL for API
const BASE_URL = `${BASEURL}/api/v1/orders`

// Thunk to fetch all orders with filters and pagination
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async ({ page, filters, partnerId }, { rejectWithValue }) => {
    try {
    
      
      const response = await axios.get(BASE_URL, {
        params: { page, ...filters, partnerId },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

// Thunk to fetch orders by vendor ID
export const fetchOrdersByVendor = createAsyncThunk(
  "orders/fetchOrdersByVendor",
  async ({ vendorId, page, filters }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/vendor/${vendorId}`, {
        params: { page, ...filters },
      });
          
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch vendor orders"
      );
    }
  }
);

// Thunk to fetch orders by user ID
export const fetchOrdersByUser = createAsyncThunk(
  "orders/fetchOrdersByUser",
  async ({ userId, page, filters }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}`, {
        params: { page, ...filters },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch user orders"
      );
    }
  }
);
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrdersById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch user orders"
      );
    }
  }
);

// Thunk to create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create order");
    }
  }
);

// Thunk to update an order
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ orderId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${orderId}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update order");
    }
  }
);

// Orders slice
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    order: {},
    pagination: {},
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    loading:false,
    message:null // Total number of orders (for pagination)
  },
  reducers: {
    resetState: (state) => {
      state.error = null; //
      state.status = "idle";
      state.loading = false;
      state.message = null;

    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch orders by vendor
      .addCase(fetchOrdersByVendor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersByVendor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrdersByVendor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch orders by user
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.orders;
        state.total = action.payload.total;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload.order;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders.unshift(action.payload); // Add new order to the list
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.orders.findIndex(
          (order) => order.order_id === action.payload.order_id
        );
        if (index !== -1) {
          state.orders[index] = action.payload; // Update the order
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetState } = ordersSlice.actions;

export default ordersSlice.reducer;
