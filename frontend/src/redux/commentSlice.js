import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create comment
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ content_type, content_id, comment_text, rating, parent_comment_id, user_id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/comment/${user_id}`, {
        content_type,
        content_id,
        comment_text,
        rating,
        parent_comment_id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get comments
export const getComments = createAsyncThunk(
  'comments/getComments',
  async ({ content_type, content_id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/comments/${content_type}/${content_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update comment
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, comment_text, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/comment/${id}`, {
        comment_text,
        rating
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/comment/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get user comments
export const getUserComments = createAsyncThunk(
  'comments/getUserComments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/user/comments');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    userComments: [],
    stats: null,
    loading: false,
    error: null,
    success: false,
    message: null
  },
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.message = null;
    }
   
  },
  extraReducers: (builder) => {
    builder
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Comments
      .addCase(getComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.stats = action.payload.stats || null;
        state.success = action.payload.success;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.comments = state.comments.filter(comment => comment.id !== action.payload.id);
        state.userComments = state.userComments.filter(comment => comment.id !== action.payload.id);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Comments
      .addCase(getUserComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserComments.fulfilled, (state, action) => {
        state.loading = false;
        state.userComments = action.payload.comments;
        state.success = action.payload.success;
      })
      .addCase(getUserComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearErrors, resetSuccess } = commentsSlice.actions;

export default commentsSlice.reducer;