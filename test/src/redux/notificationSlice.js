import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASEURL as BASE_URL } from '../baseurl';
// Async thunk to create a new notification
export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/notifications`, notificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get all notifications
export const getAllNotifications = createAsyncThunk(
  'notifications/getAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/notifications`);
      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to get notifications for a specific user
export const getUserNotifications = createAsyncThunk(
  'notifications/getUserNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/notifications/user/${userId}`);
      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to mark a notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async ({ userId, notificationId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/v1/notifications/${userId}/${notificationId}/read`);
      return { userId, notificationId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/v1/notifications/${notificationId}`);
      return { notificationId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetState: (state) => {
      state.error = null;
      state.message = null;
      state.notifications = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle create notification
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Notification Created Successfully!";
      })
      .addCase(createNotification.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = action.payload.errMessage;
      })

      // Handle get all notifications
      .addCase(getAllNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle get user notifications
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle mark notification as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const { notificationId } = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read_status = true;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(
          (notification) => notification.notification_id !== action.payload.notificationId
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export the actions and reducer
export const { resetState } = notificationSlice.actions;
export default notificationSlice.reducer;
