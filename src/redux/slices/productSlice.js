import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
  try {
    const response = await api.post(`/create-product`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getProductById = createAsyncThunk('products/getById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getProductByFarmerId = createAsyncThunk(
  "products/getByFarmerId",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/farmer-products/${farmerId}`);
      return response.data; // Ensure the response has the structure you expect
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/product/${id}`, productData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/product/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload.product);
        state.status = 'succeeded';
      })

      .addCase(getProductById.fulfilled, (state, action) => {
        console.log("Updating Redux store with product:", action.payload);
        state.product = action.payload;  // Ensure this gets updated correctly
        state.status = 'succeeded';
      })


      .addCase(getProductByFarmerId.fulfilled, (state, action) => {
        state.products = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
        state.status = 'succeeded';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload.product._id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
        state.status = 'succeeded';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
        state.status = 'succeeded';
      })
      .addCase(getProductByFarmerId.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
        state.products = [];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default productSlice.reducer;
