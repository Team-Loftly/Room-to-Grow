import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_API_URL = import.meta.env.VITE_APP_API_URL

// fetch decorations
export const fetchDecorations = createAsyncThunk(
  "market/fetchDecorations",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}/decor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
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
  selectedItem: null,
  items: [], // list of decorations, including an _id field added by mongo db
  status: "idle",
  error: null,
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDecorations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDecorations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.selectedItem = action.payload[0] || null; // Set first item as selected
      })
      .addCase(fetchDecorations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSelectedItem } = marketSlice.actions;

export const selectMarketItems = (state) => state.market.items;
export const selectSelectedItem = (state) => state.market.selectedItem;
export const selectMarketStatus = (state) => state.market.status;
export const selectMarketError = (state) => state.market.error;

export default marketSlice.reducer;
