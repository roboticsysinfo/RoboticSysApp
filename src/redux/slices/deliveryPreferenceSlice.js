import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// ✅ Fetch Delivery Preference
export const fetchDeliveryPreference = createAsyncThunk(
  "deliveryPreference/fetch",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/delivery-preference/get/${farmerId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
  }
);

// ✅ Add Delivery Preference
export const addDeliveryPreference = createAsyncThunk(
  "deliveryPreference/add",
  async (deliveryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/delivery-preference/add', deliveryData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add");
    }
  }
);

// ✅ Update Delivery Preference
export const updateDeliveryPreference = createAsyncThunk(
  "deliveryPreference/update",
  async ({ farmerId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/delivery-preference/update/${farmerId}`, updatedData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update");
    }
  }
);

const deliveryPreferenceSlice = createSlice({
  name: "deliveryPreference",
  initialState: {
    preference: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetDeliveryPreference: (state) => {
      state.preference = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Preference
      .addCase(fetchDeliveryPreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryPreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preference = action.payload;
      })
      .addCase(fetchDeliveryPreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Preference
      .addCase(addDeliveryPreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDeliveryPreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preference = action.payload;
      })
      .addCase(addDeliveryPreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Preference
      .addCase(updateDeliveryPreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryPreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preference = action.payload;
      })
      .addCase(updateDeliveryPreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDeliveryPreference } = deliveryPreferenceSlice.actions;
export default deliveryPreferenceSlice.reducer;
