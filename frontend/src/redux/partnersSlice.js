import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl"; // Import your base URL from wherever it's defined

// Base URL for API requests
const BASE_URL = `${BASEURL}/api/v1/partners`; // Adjust with your API endpoint

const sanitizeFileName = (fileName) => {
  return fileName.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
};

const appendDataToFormData = (data) => {
  const formData = new FormData();

  // Iterate over the `data` object keys
  for (const key in data) {
    if (key === "driving_license" || key === "bike_rc") {
      // Check if the value for the document key is a file
      const file = data[key];
      if (file) {
        // Sanitize the file name to avoid issues with special characters
        const sanitizedFileName = file.name
          .replace(/\s+/g, "_")
          .replace(/[^\w\-_\.]/g, "");
        // Append the file with its key to the FormData object
        formData.append(key, file, sanitizedFileName);
      }
    } else {
      // Append normal data to the FormData object
      formData.append(key, data[key]);
    }
  }

  return formData;
};

export const partnerOnboarding = createAsyncThunk(
  "partner/partnerOnboarding",
  async (data, thunkAPI) => {
    try {
      // Create a FormData object to handle file uploads
      const formData = appendDataToFormData(data);
      // Send POST request with FormData
      const response = await axios.post(`${BASE_URL}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to onboard partner"
      );
    }
  }
);
// Thunks
export const fetchPartners = createAsyncThunk(
  "partners/fetchPartners",
  async (
    { page = 1, limit = 10, search = "", partner_status = "" },
    thunkAPI
  ) => {
    try {
      const queryParams = {
        page,
        limit,
        search,
        partner_status,
      };

      // Fetch the partners data with the query parameters
      const response = await axios.get(`${BASE_URL}`, { params: queryParams });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch partners"
      );
    }
  }
);

export const fetchPartnerById = createAsyncThunk(
  "partners/fetchPartnerById",
  async (partnerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${partnerId}`);
      return response.data; // Assuming the response has the partner data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchPartnerProfile = createAsyncThunk(
  "partners/fetchPartnerProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/profile/${userId}`);
      return response.data; // Assuming the response has the partner data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePartner = createAsyncThunk(
  "partners/updatePartner",
  async ({ partnerId, updatedData }, thunkAPI) => {
   
    
    try {
      const response = await axios.put(`${BASE_URL}/${partnerId}`, updatedData);
      return partnerId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update partner"
      );
    }
  }
);

export const deletePartner = createAsyncThunk(
  "partners/deletePartner",
  async (partnerId, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/${partnerId}`);
      return partnerId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete partner"
      );
    }
  }
);

// Slice
const partnersSlice = createSlice({
  name: "partners",
  initialState: {
    partners: [],
    partner: {},
    pagination: {},
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
      // Fetch partners
      .addCase(partnerOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(partnerOnboarding.fulfilled, (state) => {
        state.loading = false;
        state.message = "Partner onboarding successfully";
      })
      .addCase(partnerOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload.partners;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch partner by ID
      .addCase(fetchPartnerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerById.fulfilled, (state, action) => {
        state.loading = false;
        state.partner = action.payload;
      })
      .addCase(fetchPartnerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPartnerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.partner = action.payload;
      })
      .addCase(fetchPartnerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update partner status
      .addCase(updatePartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePartner.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Partner status has been updated successfully";
      })
      .addCase(updatePartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete partner
      .addCase(deletePartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = state.partners.filter(
          (partner) => partner.partner_id !== action.payload.partnerId
        );
      })
      .addCase(deletePartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = partnersSlice.actions;

export default partnersSlice.reducer;
