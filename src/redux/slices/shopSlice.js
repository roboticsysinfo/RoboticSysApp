import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// Fetch all shops with pagination
export const fetchShops = createAsyncThunk(
  'shop/fetchShops',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await api.get("/farmer-shops", { params: { page, limit } });
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Get shop by farmer ID
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
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Get shop by shop ID
export const fetchShopByShopId = createAsyncThunk(
  'shop/fetchShopByShopId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/${id}`);
      return response.data.shop;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Create a new shop
export const createShop = createAsyncThunk(
  'shop/createShop',
  async (shopData, { rejectWithValue }) => {
    try {
      const response = await api.post('/create-shop', shopData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
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
      return response.data;
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
      await api.delete(`/shop/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);


export const fetchProductsByShopId = createAsyncThunk(
  "shop/fetchProductsByShopId",
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/shop-products/${shopId}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    shops: [],
    shop: null,            // for farmer-profile-specific shop
    selectedShop: null,    // ✅ used for shop detail screen
    products: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearSelectedShop: (state) => {
      state.selectedShop = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all shops
      .addCase(fetchShops.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shops = action.payload;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // fetch shop by farmer ID
      .addCase(fetchShopById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shop = action.payload?.data || null;
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.status = 'failed';
        state.shop = null;
        state.error = action.payload;
      })

      // fetch shop by shop ID
      .addCase(fetchShopByShopId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShopByShopId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedShop = action.payload;
      })
      .addCase(fetchShopByShopId.rejected, (state, action) => {
        state.status = 'failed';
        state.selectedShop = null;
        state.error = action.payload;
      })

      // create shop
      .addCase(createShop.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shops.push(action.payload);
      })
      .addCase(createShop.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // update shop
      .addCase(updateShop.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.shops.findIndex(shop => shop._id === action.payload._id);
        if (index !== -1) {
          state.shops[index] = action.payload;
        }
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // delete shop
      .addCase(deleteShop.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shops = state.shops.filter(shop => shop._id !== action.payload);
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch products by shop ID
      .addCase(fetchProductsByShopId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByShopId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload; // ✅ Store products in state
      })
      .addCase(fetchProductsByShopId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

  },
});

export const { clearSelectedShop } = shopSlice.actions;
export default shopSlice.reducer;
