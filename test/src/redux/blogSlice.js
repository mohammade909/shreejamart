// blogSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {BASEURL} from '../baseurl'
import axios from "axios";

export const getBlogs = createAsyncThunk(
  "blogs/getBlogs",
  async ({ page, filters }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/blogs`, {
        params: { page, ...filters },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (values, thunkAPI) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      const response = await fetch(`${BASEURL}/api/v1/blogs`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
     
      return data;
    } catch (error) {
      // Handle error
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
// Example asynchronous thunk to get students

export const getBlogById = createAsyncThunk(
  "blogs/getBlogById",
  async (id ,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/blogs/${id}`);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getblogByUser = createAsyncThunk(
  "blog/getblogByUser",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/blogs/user/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      
      return data;
    } catch (error) {
          // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// Example asynchronous thunk to delete student
export const deleteBlog = createAsyncThunk(
  "blog/deleteblog",
  async (blog_id, thunkAPI) => {
    try {
      // Your asynchronous logic to delete student here
      const response = await fetch(`${BASEURL}/api/v1/blogs/${blog_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
          
      return blog_id;
    } catch (error) {
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// Example asynchronous thunk to update student
export const updateBlog = createAsyncThunk(
  "blog/updateblog",
  async ({ blog_id, updatedData }, thunkAPI) => {
    try {
   
      // Your asynchronous logic to update student here
      const response = await fetch(`${BASEURL}/api/v1/blogs/${blog_id}`, {
        method: "PUT",
        body: updatedData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      // Handle error
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
  

const initialState = {
  blogs: [],
  pagination:{},
  loading: false,
  error: null,
  message: null,
  blog: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.message = null;
    },
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getblogByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getblogByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.blogs = action.payload.blogs;
      })
      .addCase(getblogByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBlogById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.blog = action.payload.blog;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Blog updated successfully";
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.blogs = state.blogs.filter((item)=>item.blog_id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {resetState } = blogSlice.actions;

export default blogSlice.reducer;
