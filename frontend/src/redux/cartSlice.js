import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL as BASE_Url } from "../baseurl";
const BASEURL = `${BASE_Url}/api/v1/cart`; // Adjust to your API base URL

// Async actions
export const fetchUserCart = createAsyncThunk(
  "cart/fetchUserCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/user/${userId}`);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error fetching cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASEURL, cartData);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error creating category"
      );
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASEURL}/update/${id}`, { action });
      console.log(response.data);

      return { cart_item_id: id, actionType: action };
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error updating category"
      );
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASEURL}/remove/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error deleting category"
      );
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {},
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create category
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Item added successfully";
        
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update category
    builder
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Cart updated successfully";

        // Find the updated cart item and update the quantity
        const { cart_item_id, actionType } = action.payload; // Make sure action.payload contains necessary info
        const itemIndex = state.cart.items.findIndex(
          (item) => item.cart_item_id === cart_item_id
        );

        if (itemIndex !== -1) {
          // Update the quantity based on actionType
          if (actionType === "INCREMENT") {
            state.cart.items[itemIndex].quantity += 1;
          } else if (actionType === "DECREMENT") {
            // Ensure quantity doesn't go below 1
            if (state.cart.items[itemIndex].quantity > 1) {
              state.cart.items[itemIndex].quantity -= 1;
            }
          }
        }
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete category
    builder
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Item removed from cart";
        state.cart.items = state.cart.items.filter(
          (item) => item.cart_item_id !== action.payload
        );
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = cartSlice.actions;
export default cartSlice.reducer;
