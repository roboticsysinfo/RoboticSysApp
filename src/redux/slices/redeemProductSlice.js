import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// Thunks Fetch All Products for Redeem
export const fetchRedeemProducts = createAsyncThunk(
  'redeemProducts/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/redeem-products');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Thunk to Redeem a Product
export const redeemProduct = createAsyncThunk(
  'redeemProducts/redeem',
  async ({ farmerId, redeemProductId }, thunkAPI) => {
    try {
      const res = await api.post('/redeem-product', { farmerId, redeemProductId });
      return res.data; // contains message and redemption info
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);



const redeemProductSlice = createSlice({
  name: 'redeemProducts',
  initialState: {
    rProducts: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearRedeemMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRedeemProducts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchRedeemProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.rProducts = action.payload;
      })
      .addCase(fetchRedeemProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Redeem product states
      .addCase(redeemProduct.pending, state => {
        state.loading = true;
      })
      .addCase(redeemProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(redeemProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Something went wrong';
      });
  }
});



export default redeemProductSlice.reducer;
