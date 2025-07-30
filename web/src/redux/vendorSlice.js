import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl";
// Base URL for API requests
const BASE_URL = `${BASEURL}/api/v1/vendors`; // Replace with your API base URL

// Thunks
export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async ({ page = 1, limit = 10, sort = "newest", search, kycStatus}, thunkAPI) => {
    try {
      
      // Construct the query string with parameters
      const queryParams = {
        page,
        limit,
        sort,
        search,
        kycStatus,
      };

      // Pass query parameters to the backend
      const response = await axios.get(`${BASE_URL}`, { params: queryParams });

      // Return the vendors and pagination info
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendors"
      );
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendor/fetchById',
  async (vendorId, { rejectWithValue }) => {
    try {
      // Make the API call to get the vendor data by ID
      const response = await axios.get(`${BASE_URL}/${vendorId}`);
       
      return response.data; // Assuming response has the vendor data
    } catch (error) {
      // In case of an error, return a custom error message
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchVendorProfile = createAsyncThunk(
  'vendor/fetchVendorProfile',
  async (userId, { rejectWithValue }) => {
    try {
      // Make the API call to get the vendor data by ID
      const response = await axios.get(`${BASE_URL}/user/${userId}`);
       
      return response.data; // Assuming response has the vendor data
    } catch (error) {
      // In case of an error, return a custom error message
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const createVendor = createAsyncThunk(
  "vendors/createVendor",
  async (vendorData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}`, vendorData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to create vendor"
      );
    }
  }
);

export const updateVendor = createAsyncThunk(
  "vendors/updateVendor",
  async ({ vendorId, updatedData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/${vendorId}`, updatedData);
      return { vendorId, updatedData, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to update vendor"
      );
    }
  }
);

export const deleteVendor = createAsyncThunk(
  "vendors/deleteVendor",
  async (vendorId, thunkAPI) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${vendorId}`);
      return { vendorId, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to delete vendor"
      );
    }
  }
);

// Slice
const vendorsSlice = createSlice({
  name: "vendors",
  initialState: {
    vendors: [],
    vendor:{},
    pagination:{},
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
    builder
      // Fetch vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.vendors;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload.vendor;
    
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVendorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload.vendor;
    
      })
      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create vendor
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.push(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update vendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vendors.findIndex(
          (vendor) => vendor.vendor_id === action.payload.vendorId
        );
        if (index !== -1) {
          state.vendors[index] = {
            ...state.vendors[index],
            ...action.payload.updatedData,
          };
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete vendor
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = state.vendors.filter(
          (vendor) => vendor.vendor_id !== action.payload.vendorId
        );
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetState } = vendorsSlice.actions;

export default vendorsSlice.reducer;
