import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = 'b3af32cfd3868aa463c4f6e188ab4de6';

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async ({ lat, lon }, thunkAPI) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) return data;
      return thunkAPI.rejectWithValue(data.message || 'Failed to fetch current weather');
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchFiveDayForecast = createAsyncThunk(
  'weather/fetchFiveDayForecast',
  async ({ lat, lon }, thunkAPI) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) return data;
      return thunkAPI.rejectWithValue(data.message || 'Failed to fetch 5-day forecast');
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    weatherData: null,
    forecastData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchWeatherData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.weatherData = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchFiveDayForecast.fulfilled, (state, action) => {
        state.forecastData = action.payload;
      })
      .addCase(fetchFiveDayForecast.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default weatherSlice.reducer;
