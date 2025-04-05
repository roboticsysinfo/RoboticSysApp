import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore } from "redux-persist";
import { persistor } from "../store";

// Register Farmer
export const registerFarmer = createAsyncThunk(
  "auth/registerFarmer",
  async (farmerData, { rejectWithValue }) => {
    try {
      if (!farmerData || typeof farmerData !== "object") {
        throw new Error("Invalid farmerData: Expected an object.");
      }

      const formData = new FormData();

      Object.keys(farmerData).forEach((key) => {
        if (key === "aadharCardImage" && farmerData[key]) {
          formData.append("uploadAadharCard", {
            uri: farmerData.aadharCardImage.uri.replace("file://", ""),
            type: farmerData.aadharCardImage.type || "image/jpeg",
            name: farmerData.aadharCardImage.fileName || "aadhar.jpg",
          });
        }else {
          formData.append(key, farmerData[key]);
        }
      });

      console.log("📦 FormData is ready to be sent!");

      // ✅ Debugging: Check if formData is correctly created
      console.log("Is formData an instance of FormData?", formData instanceof FormData);
      console.log("typeof formData:", typeof formData);

      // ✅ Instead of `entries()`, try alternative debugging
      console.log("FormData Content:");
      for (const pair of formData._parts) {
        console.log(pair[0] + ":", pair[1]);
      }

      const response = await api.post("/farmer/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
        },
      });

      console.log("✅ API Response:", response.data);
      return response.data;

    } catch (error) {
      console.error("❌ Registration API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Registration failed" });
    }
  }
);



// Get Farmer by ID (Separate state for farmer details)
export const getFarmerById = createAsyncThunk(
  "auth/getFarmerById",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/farmer/get/${farmerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch farmer" });
    }
  }
);

// Update Farmer Info
export const updateFarmerById = createAsyncThunk(
  "auth/updateFarmerById",
  async ({ farmerId, farmerData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/farmer/update/${farmerId}`, farmerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Update failed" });
    }
  }
);

// Send OTP to Farmer
export const sendOTP = createAsyncThunk("auth/sendOTP", async (phoneNumber, { rejectWithValue }) => {
  try {
    const response = await api.post('/send-otp-to-farmer', { phoneNumber });
    return response.data;
  } catch (error) {
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
    user: null, // For authenticated user
    farmerDetails: null, // Separate farmer data
    token: null,
    loading: false,
    error: null,
    otpSent: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.farmerDetails = null;
      state.token = null;
      state.error = null;
      state.otpSent = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setFarmerDetails: (state, action) => {
      state.farmerDetails = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register Farmer
      .addCase(registerFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.farmer; // ✅ New user data store
      })
      .addCase(registerFarmer.rejected, (state, action) => {
        state.loading = false;
        console.log("❌ Register Farmer Error:", action.payload);
        state.error = action.payload?.message || "Registration failed";
      })

      // Get Farmer by ID (Separating from user)
      .addCase(getFarmerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFarmerById.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerDetails = action.payload;
      })
      .addCase(getFarmerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch farmer";
      })

      // Update Farmer Info
      .addCase(updateFarmerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFarmerById.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerDetails = action.payload.farmer;
      })
      .addCase(updateFarmerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Update failed";
      })

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
      })
  },
});

export const { logout, setUser, setFarmerDetails } = authSlice.actions;
export default authSlice.reducer;
