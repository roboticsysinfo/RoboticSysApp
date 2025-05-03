// src/redux/farmerPlan/farmerPlanSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// Thunk to fetch active plan by farmerId

export const getActiveFarmerPlan = createAsyncThunk(
  'farmerPlan/getActivePlan',
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/farmer/active-plans/${farmerId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch active plan');
    }
  }
);


export const getFarmerReferralDetail = createAsyncThunk(

  "farmer/getFarmerReferralDetail",
  async (farmerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/farmer/referral-details/${farmerId}`);
      console.log("farmer referral", res.data)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Failed to fetch");
    }
  }

);


const farmerPlanSlice = createSlice({
  name: 'farmerPlan',
  initialState: {
    activePlan: null,
    referralDetail: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearActivePlan: (state) => {
      state.activePlan = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(getActiveFarmerPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getActiveFarmerPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.activePlan = action.payload;
      })

      .addCase(getActiveFarmerPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFarmerReferralDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getFarmerReferralDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.referralDetail = action.payload;
      })

      .addCase(getFarmerReferralDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


  }
});

export const { clearActivePlan } = farmerPlanSlice.actions;

export default farmerPlanSlice.reducer;
