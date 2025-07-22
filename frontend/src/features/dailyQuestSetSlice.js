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
  hasUnseenCompletedQuest: false,
};

const questsSlice = createSlice({
  name: "dailyQuestSet",
  initialState,
  reducers: {
    setHasUnseenCompletedQuest: (state, action) => {
      state.hasUnseenCompletedQuest = action.payload;
    },
    clearQuestNotification: (state) => {
      state.hasUnseenCompletedQuest = false;
    },
  },
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
          const previousQuests = state.dailyQuestSet
            ? state.dailyQuestSet.quests
            : [];
          const newQuests = dailyQuestSet.quests;

          const questJustCompleted = newQuests.some((newQuest) => {
            const oldQuest = previousQuests.find(
              (q) => q.questId._id === newQuest.questId._id
            );
            return newQuest.isComplete && (!oldQuest || !oldQuest.isComplete);
          });

          state.dailyQuestSet = dailyQuestSet;
          state.status = "succeeded";
          state.error = null;

          if (questJustCompleted) {
            state.hasUnseenCompletedQuest = true;
          }
        }
      })
      .addCase(claimDailyQuestReward.fulfilled, (state, action) => {
        state.dailyQuestSet =
          action.payload.updatedDailyQuestSet || action.payload.dailyQuestSet;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(claimDailyQuestReward.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setHasUnseenCompletedQuest, clearQuestNotification } =
  questsSlice.actions;

export const selectDailyQuests = (state) => state.quests.dailyQuestSet;
export const selectDailyQuestsStatus = (state) => state.quests.status;
export const selectDailyQueststError = (state) => state.quests.error;
export const selectHasUnseenCompletedQuest = (state) =>
  state.quests.hasUnseenCompletedQuest;

export default questsSlice.reducer;
