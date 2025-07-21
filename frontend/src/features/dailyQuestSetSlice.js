import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateProgress } from "./tasksSlice";
import axios from "axios";
const BASE_API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchDailyQuests = createAsyncThunk(
  "quests/fetchDailyQuests",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}/daily-quests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data with Axios:", error);

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

// Handles user redemption of bonus coins
export const claimDailyQuestReward = createAsyncThunk(
  "quests/claimDailyBonus",
  async (dailyQuestSetId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/daily-quests/${dailyQuestSetId}/claim-bonus`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data with Axios:", error);

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
  dailyQuestSet: null,
  status: "idle",
  error: null,
};

const questsSlice = createSlice({
  name: "dailyQuestSet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyQuests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDailyQuests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dailyQuestSet = action.payload;
        state.error = null;
      })
      .addCase(fetchDailyQuests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        const { dailyQuestSet } = action.payload;
        if (dailyQuestSet) {
          state.dailyQuestSet = dailyQuestSet;
          state.status = "succeeded";
          state.error = null;
        }
      })
      .addCase(claimDailyQuestReward.fulfilled, (state, action) => {
        state.dailyQuestSet = action.payload.questSet;
      });
  },
});

export const selectDailyQuests = (state) => state.quests.dailyQuestSet;
export const selectDailyQuestsStatus = (state) => state.quests.status;
export const selectDailyQueststError = (state) => state.quests.error;

export default questsSlice.reducer;
