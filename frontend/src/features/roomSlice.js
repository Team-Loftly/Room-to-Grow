import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchRoom = createAsyncThunk(
  "room/fetchRoom",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}/rooms`, {
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

// called whenever an action is done on our room slice
export const updateRoom = createAsyncThunk(
  "room/updateRoom",
  async (state, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/rooms/update`,
        {
          decorations: state.decorations.map((decoration) => ({
            model: decoration.model,
            placed: decoration.placed,
            position: decoration.position,
            rotation: decoration.rotation,
            scale: decoration.scale,
          })),
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

export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/rooms/create`,
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
  decorations: [], // Array to hold the decorations
  status: "idle",
  error: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.decorations = action.payload.decorations.map((decoration) => ({
          model: decoration.decorId.modelID, // Extract modelID from decorId object
          placed: decoration.placed,
          position: decoration.position,
          rotation: decoration.rotation,
          scale: decoration.scale,
        }));
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateDecorationPosition, updateDecorationRotation } =
  roomSlice.actions;
export default roomSlice.reducer;
