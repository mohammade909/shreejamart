import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { BASEURL } from "../baseurl";
// Base URL for API

// Fetch all teachers
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (params, { rejectWithValue }) => {
    try {
      // Destructure the params to get 'detailed' if provided
      const { detailed } = params || {};
      
      // Build the URL with query parameters if 'detailed' is specified
      const url = detailed ? `${BASEURL}/api/v1/teachers?detailed=true` : `${BASEURL}/api/v1/teachers`;

      const response = await axios.get(url);
      return response.data.data
      ;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



// Fetch a single teacher by ID
export const fetchTeacherById = createAsyncThunk(
  "teachers/fetchTeacherById",
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/teachers/${teacherId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTeacherByUserId = createAsyncThunk(
  "teachers/fetchTeacherByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/teachers/user/${userId}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new teacher
export const createTeacher = createAsyncThunk(
  "teachers/createTeacher",
  async (teacherData, { rejectWithValue }) => {
    try {
      // No need to set headers explicitly here, axios will handle it for multipart/form-data
      const response = await axios.post(
        `${BASEURL}/api/v1/teachers`,
        teacherData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Just to make sure it's set correctly, although axios handles this automatically
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Update an existing teacher
export const updateTeacher = createAsyncThunk(
  "teachers/updateTeacher",
  async ({ teacherId, teacherData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASEURL}/api/v1/teachers/${teacherId}`, teacherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a teacher
export const deleteTeacher = createAsyncThunk(
  "teachers/deleteTeacher",
  async (teacherId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASEURL}/api/v1/teachers/${teacherId}`);
      return teacherId; // Return the deleted teacher's ID
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  teachers: [],
  teacher: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null
    },
  },
  extraReducers: (builder) => {
    // Fetch all teachers
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch teacher by ID
    builder
      .addCase(fetchTeacherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.loading = false;
        state.teacher = action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchTeacherByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.teacher = action.payload;
      })
      .addCase(fetchTeacherByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create teacher
    builder
      .addCase(createTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Teacher Created Successfully!' // Add the new teacher
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });

    // Update teacher
    builder
      .addCase(updateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.teachers = state.teachers.map((teacher) =>
          teacher.teacher_id === action.payload.teacher_id
            ? action.payload
            : teacher
        );
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete teacher
    builder
      .addCase(deleteTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.teachers = state.teachers.filter(
          (teacher) => teacher.teacher_id !== action.payload
        );
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = teacherSlice.actions;
export default teacherSlice.reducer;
