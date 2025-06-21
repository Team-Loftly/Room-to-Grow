import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_API_URL = import.meta.env.VITE_APP_API_URL

export const fetchStats = createAsyncThunk(
  "stats/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/metrics`);

      const data = response.data;

      const statsJson = data.result || [];

      return statsJson;
    } catch (error) {
      console.error("Error fetching data with Axios:", error);

      // details in error.response for HTTP errors, error.request for network errors, error.message for other errors
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        return rejectWithValue(
          error.response.data.error ||
            `Request failed with status ${error.response.status}`
        );
      } else if (axios.isAxiosError(error) && error.request) {
        console.error("No response received:", error.request);
        return rejectWithValue("Network error: No response from server.");
      } else {
        console.error("Error message:", error.message);
        return rejectWithValue(error.message || "An unknown error occurred.");
      }
    }
  }
);

const initialState = {
  stats: {
    hoursSpent: {
      "This Week": 0,
      "Last Week": 0,
      Total: 0,
    },
    tasksCompleted: {
      "This Week": 20,
      "Last Week": 10,
      Total: 50,
    },

    categoryHours: {},
  },
  status: "idle",
  error: null,
};

const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {
    incrementHours: (state, action) => {
      const { category, hours } = action.payload;
      if (state.categoryHours[category] !== undefined) {
        state.categoryHours[category] += hours;
      }
      state.hoursSpent["This Week"] += hours;
      state.hoursSpent["Total"] += hours;
    },

    completeTask: (state, action) => {
      state.tasksCompleted["This Week"] += 1;
      state.tasksCompleted["Total"] += 1;
    },

    resetWeeklyMetrics: (state) => {
      state.hoursSpent["This Week"] = 0;
      state.tasksCompleted["This Week"] = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { incrementHours, completeTask, resetWeeklyMetrics } =
  metricsSlice.actions;

export default metricsSlice.reducer;
