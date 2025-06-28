// tracks user inventory of items
// tracks user number of coins
import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
const BASE_API_URL = import.meta.env.VITE_APP_API_URL

export const spendCoinsAndUpdate = (amount) => (dispatch, getState) => {
  dispatch(spendCoins(amount));
  const state = getState().inventory;
  dispatch(updateInventory(state));
};

export const addItemAndUpdate = (item) => (dispatch, getState) => {
  dispatch(addItem(item));
  const state = getState().inventory;
  dispatch(updateInventory(state));
};

export const addCoinsAndUpdate = (amount) => (dispatch, getState) => {
  dispatch(addCoins(amount));
  const state = getState().inventory;
  dispatch(updateInventory(state));
};

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}/inventory`, {
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

// called whenever an action is done on our inventory slice
export const updateInventory = createAsyncThunk(
  "inventory/updateInventory",
  async (state, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/inventory/update`,
        {
          coins: state.coins,
          decorations: state.decorations,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

export const createInventory = createAsyncThunk(
  "inventory/updateInventory",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/inventory/create`,
        {}, // body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  coins: 0,
  decorations: [], // list of decoration _id fields
  status: "idle",
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addCoins: (state, action) => {
      state.coins += action.payload;
    },
    spendCoins: (state, action) => {
      if (state.coins >= action.payload) {
        state.coins -= action.payload;
      }
    },
    addItem: (state, action) => {
      state.decorations.push(action.payload); // must be an _id
    },
    removeItem: (state, action) => {
      state.decorations = state.decorations.filter( // must be an _id
        (id) => id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.decorations = action.payload.decorations;
        state.coins= action.payload.coins;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addCoins, spendCoins, addItem, removeItem } =
  inventorySlice.actions;

export const selectInventoryItems = (state) => state.inventory.decorations;
export const selectInventoryCoins = (state) => state.inventory.coins;
export const selectInventoryStatus = (state) => state.inventory.status;
export const selectInventoryError = (state) => state.inventory.error;

export default inventorySlice.reducer;
