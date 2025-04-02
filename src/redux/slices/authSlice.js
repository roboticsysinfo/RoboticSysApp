import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore } from "redux-persist";
import { persistor } from "../store";


// Send OTP to Farmer
export const sendOTP = createAsyncThunk("auth/sendOTP", async (phoneNumber, { rejectWithValue }) => {
  try {

    const response = await api.post('/send-otp-to-farmer', { phoneNumber });

    return response.data;
  } catch (error) {
    console.error("sendOTP Error:", error.response?.data || error.message);

    return rejectWithValue(error.response?.data || { message: "Failed to send OTP" });
  }
});


// Verify OTP & Login
export const loginWithOTP = createAsyncThunk("auth/loginWithOTP", async ({ phoneNumber, otp }, { rejectWithValue }) => {
  try {

    const response = await api.post('/farmer-login-otp-verify', { phoneNumber, otp });

    return response.data;
  } catch (error) {

    return rejectWithValue(error.response.data);
  }
  
});

// Logout action to clear storage
export const logoutUser = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("farmer");
    dispatch(logout());
    persistor.purge(); // 🔹 Redux persist data clear karega
  } catch (error) {
    console.error("Logout Error:", error);
  }
};


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    otpSent: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.otpSent = false;
    },
    setUser: (state, action) => { 
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send OTP";
      })

      // Login with OTP
      .addCase(loginWithOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.farmer; 
      })
      .addCase(loginWithOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      });
  },
});


export const { logout , setUser } = authSlice.actions;
export default authSlice.reducer;
