import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// Thunks for fetching data
export const fetchShops = createAsyncThunk(
  'shop/fetchShops',
  async ({ page, limit }, { rejectWithValue }) => {
    try {

      const response = await api.get("/farmer-shops", { params: { page, limit } });

      console.log("shop redux api response", response.data.data)

      return response.data.data || [];
        // Assuming the shops are inside the 'data' array
    } catch (error) {

      return rejectWithValue(error.message);  // Handle errors
    }
  }
);


// Get Shop by Farmer Id
export const fetchShopById = createAsyncThunk(
  'shop/fetchShopById',
  async (farmerId, { rejectWithValue }) => {
    try {

      const response = await api.get(`/farmer-shop/${farmerId}`);


      if (!response.data || !response.data.data) {
        return rejectWithValue("Shop not found");
      }

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// Create shop
export const createShop = createAsyncThunk(
  'shop/createShop',
  async (shopData, { rejectWithValue }) => {
    try {
      const response = await api.post('/create-shop', shopData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // Assuming the response contains the newly created shop
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);


// Update shop
export const updateShop = createAsyncThunk(
  'shop/updateShop',
  async ({ id, shopData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/shop/${id}`, shopData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // Returning updated shop data
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Delete shop
export const deleteShop = createAsyncThunk(
  'shop/deleteShop',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/shop/${id}`);
      return id; // Return shop ID to delete it from the state
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Fetch Shop by Shop Id
export const fetchShopByShopId = createAsyncThunk(
  'shop/fetchShopByShopId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/${id}`);

      return response.data.shop; // Ensure ki sirf shop object mile
    } catch (error) {

      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);


const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    shops: [],
    shop: null,
    products: [],
    status: 'idle', // Can be 'idle', 'loading', 'succeeded', or 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shops = action.payload || [];  // Ensure payload is valid
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Handle errors from rejected action
      });

    // Fetch shop by ID
    builder
      .addCase(fetchShopById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shop = action.payload?.data || null;  // ✅ Make sure state.shop gets updated
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.status = 'failed';
        state.shop = null;
        state.error = action.payload;
      });

    // Create shop
    builder
      .addCase(createShop.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shops.push(action.payload); // Add new shop to the list
      })
      .addCase(createShop.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Update shop
    builder
      .addCase(updateShop.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.shops.findIndex((shop) => shop._id === action.payload._id);
        if (index !== -1) {
          state.shops[index] = action.payload; // Update the shop in the list
        }
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Delete shop
    builder
      .addCase(deleteShop.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shops = state.shops.filter((shop) => shop._id !== action.payload); // Remove deleted shop from the list
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Get Shop by SHop id  
    builder
      .addCase(fetchShopByShopId.pending, (state) => {
        state.status = 'loading';
        state.shop = null; // ✅ Clear previous shop data
      })
      .addCase(fetchShopByShopId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shop = action.payload; // ✅ Redux state mein shop set karega
      })
      .addCase(fetchShopByShopId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });


  },
});

export default shopSlice.reducer;
