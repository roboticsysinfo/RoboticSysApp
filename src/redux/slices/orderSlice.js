import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


export const getOrderRequestByFarmerId = createAsyncThunk(
    "requestOrder/getOrderRequestByFarmerId",
    async (farmerId, { rejectWithValue }) => {
      try {
        const response = await api.get(`/order-requests/farmer/${farmerId}`);
        return response.data.requests;
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Server error");
      }
    }
  );
  


export const approveOrderRequest = createAsyncThunk(
  "requestOrder/approveOrderRequest",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/approve/${orderId}`, {
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to approve order");
    }
  }
);


// Cancel Order Request
export const cancelOrderRequest = createAsyncThunk(
  "requestOrder/cancelOrderRequest",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cancel/${orderId}`, {}, {
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to cancel order");
    }
  }
);

// --------------------------------------------------------

const orderSlice = createSlice({
  name: "requestOrder",
  initialState: {
    requests: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Get orders for a specific farmer
      .addCase(getOrderRequestByFarmerId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderRequestByFarmerId.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getOrderRequestByFarmerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveOrderRequest.fulfilled, (state, action) => {
        state.requests = state.requests.map((order) =>
          order._id === action.payload._id ? { ...order, status: "accepted" } : order
        );
      })

      // Cancel Order Request
      .addCase(cancelOrderRequest.fulfilled, (state, action) => {
        state.requests = state.requests.map((order) =>
          order._id === action.payload.requestOrder._id ? { ...order, status: "cancelled" } : order
        );
        state.successMessage = action.payload.message;
      })
      .addCase(cancelOrderRequest.rejected, (state, action) => {
        state.error = action.payload;
      })

},
});

export const { clearMessages } = orderSlice.actions;
export default orderSlice.reducer;
