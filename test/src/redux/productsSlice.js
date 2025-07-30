import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl";
// Base URL for API requests
const BASE_URL = `${BASEURL}/api/v1/products`; // Replace with your API base URL

// Thunks
export const fetchProducts = createAsyncThunk(
  "vendors/fetchProducts",
  async (
    {
      page = 1,
      limit = 10,
      sort = "newest",
      search = "",
      category = [], // Updated to accept an array of IDs
      status = "",
      vendorId = "",
    },
    thunkAPI
  ) => {
    try {
      // Convert category array to a format suitable for query parameters (e.g., comma-separated string)
      const categoryParam = Array.isArray(category) ? category.join(",") : category;

      // Construct the query string with parameters, including the formatted category
      const queryParams = {
        page,
        vendorId,
        limit,
        sort,
        search,
        category: categoryParam,
        status,
      };

      // Pass query parameters to the backend
      const response = await axios.get(`${BASE_URL}`, { params: queryParams });

      // Return the products and pagination info
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);


export const fetchProductById = createAsyncThunk(
  "vendor/fetchById",
  async (productId, { rejectWithValue }) => {
    try {
      // Make the API call to get the vendor data by ID
      const response = await axios.get(`${BASE_URL}/${productId}`);

      return response.data; // Assuming response has the vendor data
    } catch (error) {
      // In case of an error, return a custom error message
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const sanitizeFileName = (fileName) => {
  return fileName.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
};

export const createProduct = createAsyncThunk(
  "vendors/createProduct",
  async (productData, thunkAPI) => {
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();

      // Append normal data to the FormData object
      for (const key in productData) {
        if (key !== "featured_image" && key !== "other_images") {
          formData.append(key, productData[key]);
        }
      }

      // Append the featured image file (if it exists) to the FormData object
      if (productData.featured_image) {
        // Sanitize the file name and append the file itself
        const sanitizedFeaturedImageName = sanitizeFileName(
          productData.featured_image.name
        );
        formData.append(
          "featured_image",
          productData.featured_image,
          sanitizedFeaturedImageName
        );
      }

      // Append other images (files) as an array of sanitized names
      if (productData.other_images && Array.isArray(productData.other_images)) {
        productData.other_images.forEach((file) => {
          const sanitizedImageName = sanitizeFileName(file.name);
          formData.append("other_images", file, sanitizedImageName);
        });
      }

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
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "vendors/updateProduct",
  async ({ productId, updatedData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/${productId}`, updatedData);
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to update vendor"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "vendors/deleteProduct",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${productId}`);
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to delete vendor"
      );
    }
  }
);

// Slice
const vendorsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: {},
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
      // Fetch vendors
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create vendor
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Product Stock has been created successfully";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update vendor
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Product has been updated successfully";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete vendor
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.product_id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { resetState } = vendorsSlice.actions;

export default vendorsSlice.reducer;
