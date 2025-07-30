import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL as BS } from "../baseurl";

const BASEURL = `${BS}/api/v1/reviews`;
// Async Thunks for API Interactions
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASEURL}/create`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchReviewsByEntity = createAsyncThunk(
  "reviews/fetchByEntity",
  async ({ entityType, entityId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/${entityType}/${entityId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAverageRating = createAsyncThunk(
  "reviews/fetchAverageRating",
  async ({ entityType, entityId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/average-rating/${entityType}/${entityId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASEURL}/update/${reviewId}`,
        reviewData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASEURL}/delete/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Reviews Slice
const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    entityReviews: {},
    averageRatings: {},
    loading: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Reviews by Entity
      .addCase(fetchReviewsByEntity.fulfilled, (state, action) => {
        const { entityType, entityId } = action.meta.arg;
        state.reviews = action.payload.reviews;
      })

      // Fetch Average Rating
      .addCase(fetchAverageRating.fulfilled, (state, action) => {
        const { entityType, entityId } = action.meta.arg;
        state.averageRatings[`${entityType}_${entityId}`] = action.payload;
      })

      // Update Review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (review) => review.review_id === action.meta.arg.reviewId
        );
        if (index !== -1) {
          state.reviews[index] = { ...state.reviews[index], ...action.payload };
        }
      })

      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review.review_id !== action.payload
        );
      });
  },
});

export const { resetState } = reviewsSlice.actions;
export default reviewsSlice.reducer;
