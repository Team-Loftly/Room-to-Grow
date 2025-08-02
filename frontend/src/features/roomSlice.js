import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_API_URL = import.meta.env.VITE_APP_API_URL;
import { claimDailyQuestReward } from "./dailyQuestSetSlice";
import { updateProgress } from "./tasksSlice";

// Fetch room data (current user or friend)
export const fetchRoom = createAsyncThunk(
  "room/fetchRoom",
  async (friendUsername, { rejectWithValue }) => {
    try {
      if (friendUsername) {
        // fetch the friend's room
        const response = await axios.get(`${BASE_API_URL}/rooms/friend`, {
          params: { friendUsername },
        });
        return response.data;
      } else {
        // fetch the current user's room
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_API_URL}/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.error ||
            `Request failed with status ${error.response.status}`
        );
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue("Network error: No response from server.");
      } else {
        return rejectWithValue(error.message || "An unknown error occurred.");
      }
    }
  }
);

// Update room data (decorations, coins, etc.)
export const updateRoom = createAsyncThunk(
  "room/updateRoom",
  async (updateData, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");
      const currentState = getState().room;

      // Merge current state with any updates
      const dataToUpdate = {
        coins: updateData.coins !== undefined ? updateData.coins : currentState.coins,
        decorations: updateData.decorations !== undefined ? updateData.decorations : currentState.decorations,
        ...updateData
      };

      const response = await axios.post(
        `${BASE_API_URL}/rooms/update`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch updated data to ensure consistency
      const fetchResponse = await axios.get(`${BASE_API_URL}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return fetchResponse.data;
    } catch (error) {
      console.error("Error updating room data:", error);
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.error ||
            `Request failed with status ${error.response.status}`
        );
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue("Network error: No response from server.");
      } else {
        return rejectWithValue(error.message || "An unknown error occurred.");
      }
    }
  }
);

// Create room
export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/rooms/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating room:", error);
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.error ||
            `Request failed with status ${error.response.status}`
        );
      } else if (axios.isAxiosError(error) && error.request) {
        return rejectWithValue("Network error: No response from server.");
      } else {
        return rejectWithValue(error.message || "An unknown error occurred.");
      }
    }
  }
);

// Thunk actions for inventory operations
export const spendCoinsAndUpdate = (amount) => async (dispatch, getState) => {
  const currentState = getState().room;
  if (currentState.coins >= amount) {
    dispatch(spendCoins(amount));
    await dispatch(updateRoom({ coins: currentState.coins - amount }));
  }
};

export const addItemAndUpdate = (item) => async (dispatch, getState) => {
  dispatch(addItem(item));
  const newState = getState().room;
  await dispatch(updateRoom({ decorations: newState.decorations }));
};

export const addCoinsAndUpdate = (amount) => async (dispatch, getState) => {
  const currentState = getState().room;
  dispatch(addCoins(amount));
  await dispatch(updateRoom({ coins: currentState.coins + amount }));
};

const initialState = {
  // Room decoration data
  decorations: [],

  // Inventory data
  coins: 0,

  // State management
  status: "idle", // idle | loading | succeeded | failed
  error: null,

  // Friend room viewing
  isViewingFriend: false,
  friendUsername: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    // Decoration management
    updateDecorationPosition(state, action) {
      const { index, position } = action.payload;
      if (state.decorations[index]) {
        state.decorations[index].position = position;
      }
    },
    updateDecorationRotation(state, action) {
      const { index, rotation } = action.payload;
      if (state.decorations[index]) {
        state.decorations[index].rotation = rotation;
      }
    },
    toggleDecorationPlacement(state, action) {
      const index = action.payload;
      if (state.decorations[index]) {
        state.decorations[index].placed = !state.decorations[index].placed;
      }
    },

    // Inventory management (local state updates)
    addCoins: (state, action) => {
      state.coins += action.payload;
    },
    spendCoins: (state, action) => {
      if (state.coins >= action.payload) {
        state.coins -= action.payload;
      }
    },
    addItem: (state, action) => {
      state.decorations.push({
        decorId: action.payload,
        placed: false,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
      });
    },
    removeItem: (state, action) => {
      state.decorations = state.decorations.filter(
        (item) => item.decorId !== action.payload
      );
    },

    // Friend room viewing
    setViewingFriend: (state, action) => {
      state.isViewingFriend = action.payload.isViewingFriend;
      state.friendUsername = action.payload.friendUsername;
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch room
      .addCase(fetchRoom.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.decorations = action.payload.decorations || [];
        state.coins = action.payload.coins || 0;
        state.error = null;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Update room
      .addCase(updateRoom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.decorations = action.payload.decorations || [];
        state.coins = action.payload.coins || 0;
        state.error = null;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Create room
      .addCase(createRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.decorations = action.payload.decorations || [];
        state.coins = action.payload.coins || 0;
        state.error = null;
      })

      // Handle external actions that affect coins
      .addCase(claimDailyQuestReward.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload.newCoins === "number") {
          state.coins = action.payload.newCoins;
          state.status = "succeeded";
        }
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload.newCoins === "number") {
          state.coins = action.payload.newCoins;
          state.status = "succeeded";
        }
      });
  },
});

export const {
  updateDecorationPosition,
  updateDecorationRotation,
  toggleDecorationPlacement,
  addCoins,
  spendCoins,
  addItem,
  removeItem,
  setViewingFriend,
  clearError,
} = roomSlice.actions;

// Selectors
export const selectDecorations = (state) => state.room.decorations;
export const selectCoins = (state) => state.room.coins;
export const selectRoomStatus = (state) => state.room.status;
export const selectRoomError = (state) => state.room.error;
export const selectIsViewingFriend = (state) => state.room.isViewingFriend;
export const selectFriendUsername = (state) => state.room.friendUsername;

// Legacy selectors for backward compatibility
export const selectInventoryItems = selectDecorations;
export const selectInventoryCoins = selectCoins;
export const selectInventoryStatus = selectRoomStatus;
export const selectInventoryError = selectRoomError;

export default roomSlice.reducer;
