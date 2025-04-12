import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// Send a family request (Customer → Farmer)
export const sendFamilyRequest = createAsyncThunk(
  'family/sendRequest',
  async ({ fromCustomer, toFarmer }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/family-farmer-request/send', {
        fromCustomer,
        toFarmer,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Get requests for a specific farmer
export const getRequestsForFarmer = createAsyncThunk(
  'family/getRequestsForFarmer',
  async (farmerId, { rejectWithValue }) => {
    try {

        console.log("farmer id redux", farmerId)

      const response = await api.get(`/family-farmer-requests/${farmerId}`);

      console.log("api response redux get farmer request by id", response.data)

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all requests (Admin use)
export const getAllFamilyRequests = createAsyncThunk(
  'family/getAllRequests',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/family-farmer-requests/all');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update request status (accept/reject)
export const updateRequestStatus = createAsyncThunk(
  'family/updateRequestStatus',
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/family-farmer-request/status/${requestId}`, {
        status,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const familyFarmerSlice = createSlice({
  name: 'familyfarmer',
  initialState: {
    requests: [],
    allRequests: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearFamilyMessages: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Send Request
      .addCase(sendFamilyRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendFamilyRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(sendFamilyRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Get Farmer Requests
      .addCase(getRequestsForFarmer.pending, (state) => {
        state.loading = true;
      })
      
      .addCase(getRequestsForFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getRequestsForFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Get All Requests
      .addCase(getAllFamilyRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFamilyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.allRequests = action.payload;
      })
      .addCase(getAllFamilyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update Request Status
      .addCase(updateRequestStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearFamilyMessages } = familyFarmerSlice.actions;
export default familyFarmerSlice.reducer;
