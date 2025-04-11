// redux/slices/farmingTipsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// FETCH all tips (for farmer)
export const fetchFarmerTips = createAsyncThunk(
  'farmingTips/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/farming-tips/get');
      console.log("farming tips redux", res.data)
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error fetching tips');
    }
  }
);

// CREATE new tip (admin)
export const createFarmingTip = createAsyncThunk(
  'farmingTips/create',
  async (tipData, thunkAPI) => {
    try {
      const res = await api.post('/farming-tip/add', tipData);
      return res.data.tip;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error creating tip');
    }
  }
);

// UPDATE tip (admin)
export const updateFarmingTip = createAsyncThunk(
  'farmingTips/update',
  async ({ id, tipData }, thunkAPI) => {
    try {
      const res = await api.put(`/farming-tip/update/${id}`, tipData);
      return res.data.tip;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error updating tip');
    }
  }
);

// DELETE tip (admin)
export const deleteFarmingTip = createAsyncThunk(
  'farmingTips/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/farming-tip/delete/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error deleting tip');
    }
  }
);


const initialState = {
    tips: [],
    loading: false,
    error: null,
    successMessage: null,
  };

const farmingTipsSlice = createSlice({
  name: 'farmingTips',
  initialState,
  reducers: {
    clearTipMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchFarmerTips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerTips.fulfilled, (state, action) => {
        state.loading = false;
        state.tips = action.payload;
      })
      .addCase(fetchFarmerTips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createFarmingTip.fulfilled, (state, action) => {
        state.tips.unshift(action.payload);
        state.successMessage = 'Tip added successfully';
      })
      .addCase(createFarmingTip.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateFarmingTip.fulfilled, (state, action) => {
        state.tips = state.tips.map((tip) =>
          tip._id === action.payload._id ? action.payload : tip
        );
        state.successMessage = 'Tip updated successfully';
      })
      .addCase(updateFarmingTip.rejected, (state, action) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteFarmingTip.fulfilled, (state, action) => {
        state.tips = state.tips.filter((tip) => tip._id !== action.payload);
        state.successMessage = 'Tip deleted successfully';
      })
      .addCase(deleteFarmingTip.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTipMessages } = farmingTipsSlice.actions;
export default farmingTipsSlice.reducer;
