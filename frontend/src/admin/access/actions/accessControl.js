import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../../baseurl";


export const getUserPermissions = createAsyncThunk(
  "access/getUserPermissions",
  async ({ userId, token }, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/permissions/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      
      const data = await response.json();
  
      return data; 
    } catch (error) {
      console.log(error);
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const getPermissions = createAsyncThunk(
  "access/getPermissions",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/permissions`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      // Handle error
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const addPermissions = createAsyncThunk(
  "access/addPermissions",
  async (values, thunkAPI) => {
    try {
      // Your asynchronous logic to add student here
      const response = await fetch(`${BASEURL}/api/v1/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

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
export const addPermissionColumn = createAsyncThunk(
  "access/addPermissionColumn",
  async (values, thunkAPI) => {
    try {
      // Your asynchronous logic to add student here
      const response = await fetch(`${BASEURL}/api/v1/permissions/add-entity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({entity:values}),
      });

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
export const updateAccessPermissions = createAsyncThunk(
  "access/updateAccessPermissions",
  async ({ userId, values }, thunkAPI) => {
    try {
      // Your asynchronous logic to add student here
      const response = await fetch(`${BASEURL}/api/v1/permissions/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

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


