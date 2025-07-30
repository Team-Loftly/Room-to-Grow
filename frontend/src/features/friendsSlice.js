import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_API_URL = import.meta.env.VITE_APP_API_URL;

// fetch friends
export const fetchFriends = createAsyncThunk(
  "market/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}/friends`, {
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

export const addFriend = createAsyncThunk(
  "market/addFriend",
  async (username, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/friends/add`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.friends;
    } catch (error) {
      console.error("Error adding friend with Axios:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        return rejectWithValue(
          error.response.data.message ||
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

export const removeFriend = createAsyncThunk(
  "market/removeFriend",
  async (username, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${BASE_API_URL}/friends/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { username },
        }
      );

      return response.data.friends;
    } catch (error) {
      console.error("Error adding friend with Axios:", error);

      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        return rejectWithValue(
          error.response.data.message ||
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
    currentFriend: null,
    friends: [], // list of friends (usernames)
    status: "idle",
    error: null,
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentFriend: (state, action) => {
        state.currentFriend = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = action.payload;
        state.error = null;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = action.payload;
        state.error = null;
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = action.payload;
        state.error = null;
      })
      .addCase(removeFriend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { clearError, setCurrentFriend } = friendsSlice.actions;
export const selectFriends = (state) => state.friends.friends;
export const selectFriendsStatus = (state) => state.friends.status;
export const selectCurrentFriend = (state) => state.friends.currentFriend;
export const selectFriendsError = (state) => state.friends.error;

export default friendsSlice.reducer;
