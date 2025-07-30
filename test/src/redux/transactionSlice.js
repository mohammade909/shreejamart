import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl";

const BASE_URL = `${BASEURL}/api/v1`;

// Existing fetch thunks...
export const fetchTransactionsByUserId = createAsyncThunk(
  "transactions/fetchByUserId",
  async ({ userId, page, filters }, { rejectWithValue }) => {
    console.log(userId);
    
    try {
      const response = await axios.get(
        `${BASE_URL}/transactions/user/${userId}`,
        {
          params: { page, ...filters },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async ({ page, filters }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/transactions`, {
        params: { page, ...filters },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// New: Create Transaction Thunk
export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/transactions`,
        transactionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// New: Update Transaction Thunk
export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ transactionId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/transactions/${transactionId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    pagination: {},
    loading: false,
    error: null,
    lastCreatedTransaction: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearLastCreatedTransaction(state) {
      state.lastCreatedTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing fetch cases...
      .addCase(fetchTransactionsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
        state.matrix = action.payload.matrix;
      })
      .addCase(fetchTransactionsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
        state.matrix = action.payload.matrix;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // New: Create Transaction Cases
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
        state.lastCreatedTransaction = action.payload;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // New: Update Transaction Cases
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastCreatedTransaction } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;
