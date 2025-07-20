import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchAllTasks = createAsyncThunk(
  "tasks/fetchAllTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}/habits/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const frontendTask = response.data;

      return frontendTask;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}/habits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const frontendTask = response.data;

      return frontendTask;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_API_URL}/habits`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const backendHabit = response.data;

      const frontendTask = {
        ...backendHabit,
      };

      return frontendTask;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_API_URL}/habits/${taskData._id}`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const backendHabit = response.data;

      const frontendTask = {
        ...backendHabit,
      };

      return frontendTask;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_API_URL}/habits/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { deletedId } = response.data;

      return deletedId;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const updateProgress = createAsyncThunk(
  "tasks/updateProgress",
  async (progress, { rejectWithValue }) => {
    try {
      const taskId = progress.taskId;
      const value = progress.value;

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/habits/${taskId}/complete`,
        { value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const backendHabit = response.data;

      const frontendTask = { ...backendHabit, ...backendHabit };

      return frontendTask;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const markSkipped = createAsyncThunk(
  "tasks/markSkipped",
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/habits/${taskId}/skip`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const backendHabit = response.data;

      const frontendTask = { ...backendHabit, ...backendHabit };

      return frontendTask;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const markFailed = createAsyncThunk(
  "tasks/markFailed",
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_API_URL}/habits/${taskId}/fail`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const backendHabit = response.data;

      const frontendTask = { ...backendHabit, ...backendHabit };

      return frontendTask;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const fillTaskLists = (state, tasks) => {
  state.taskList = [];
  state.completedTaskList = [];
  state.failedTaskList = [];
  state.skippedTaskList = [];

  tasks.map((task) => {
    if (task.progress.status === "incomplete") {
      state.taskList.push(task);
    } else if (task.progress.status === "complete") {
      state.completedTaskList.push(task);
    } else if (task.progress.status === "failed") {
      state.failedTaskList.push(task);
    } else if (task.progress.status === "skipped") {
      state.skippedTaskList.push(task);
    }
  });
};

const initialState = {
  selectedTaskId: -1,
  allTaskList: [],
  allHabitsStatus: "idle",
  allHabitsError: "",
  taskList: [],
  completedTaskList: [],
  failedTaskList: [],
  skippedTaskList: [],
  status: "idle",
  error: null,
  isDeleteSnackbarOpen: false,
  isCompletionSnackbarOpen: false,
  showAllTasks: false,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setShowAllTasks: (state, action) => {
      state.showAllTasks = action.payload;
    },
    setSelectedTaskId: (state, action) => {
      const { taskId } = action.payload;
      state.selectedTaskId = taskId;
    },
    updateCheckmarkProgress: (state, action) => {
      const { taskId, progressMade } = action.payload;
      const task = state.taskList.find((t) => t._id == taskId);
      task.progress = task.progress + progressMade;
    },
    setIsDeleteSnackbarOpen: (state, action) => {
      state.isDeleteSnackbarOpen = action.payload;
    },
    setIsCompletionSnackbarOpen: (state, action) => {
      state.isCompletionSnackbarOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const newTask = action.payload;
        const { progress, ...restOfPayload } = newTask;
        state.allTaskList.push(restOfPayload);

        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const today = dayNames[new Date().getDay()];

        if (
          newTask.days &&
          Array.isArray(newTask.days) &&
          newTask.days.includes(today)
        ) {
          state.taskList.push(newTask);
        }
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.status = "idle";

        const { progress, ...restOfPayload } = action.payload;
        let index = state.allTaskList.findIndex(
          (task) => task._id === action.payload._id
        );

        if (index !== -1) {
          state.allTaskList[index] = restOfPayload;
        }

        // Find the index of the task to update
        index = state.taskList.findIndex(
          (task) => task._id === action.payload._id
        );

        if (index !== -1) {
          state.taskList[index] = action.payload;
        }

        if (index === -1) {
          index = state.completedTaskList.findIndex(
            (task) => task._id === action.payload._id
          );

          if (index !== -1) {
            state.completedTaskList[index] = action.payload;
          }
        }

        if (index === -1) {
          index = state.failedTaskList.findIndex(
            (task) => task._id === action.payload._id
          );
          if (index !== -1) {
            state.failedTaskList[index] = action.payload;
          }
        }

        if (index === -1) {
          index = state.skippedTaskList.findIndex(
            (task) => task._id === action.payload._id
          );
          if (index !== -1) {
            state.skippedTaskList[index] = action.payload;
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.allHabitsStatus = "succeeded";
        state.allTaskList = action.payload;
        state.allHabitsError = null;
      })
      .addCase(fetchAllTasks.pending, (state) => {
        state.allHabitsStatus = "loading";
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.allHabitsStatus = "failed";
        state.allHabitsError = action.payload;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        fillTaskLists(state, action.payload);
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        // Find the index of the task to update
        let index = state.taskList.findIndex(
          (task) => task._id === action.payload._id
        );

        if (index !== -1) {
          state.taskList[index] = action.payload;
          if (action.payload.progress.status === "complete") {
            state.taskList.splice(index, 1);
            state.completedTaskList.push(action.payload);
          }
        }

        if (index === -1) {
          index = state.completedTaskList.findIndex(
            (task) => task._id === action.payload._id
          );
          if (index !== -1) {
            state.completedTaskList.splice(index, 1);
            state.taskList.push(action.payload);
          }
        }

        if (index === -1) {
          index = state.skippedTaskList.findIndex(
            (task) => task._id === action.payload._id
          );
          if (index !== -1) {
            state.skippedTaskList.splice(index, 1);
            state.taskList.push(action.payload);
          }
        }

        if (index === -1) {
          index = state.failedTaskList.findIndex(
            (task) => task._id === action.payload._id
          );
          if (index !== -1) {
            state.failedTaskList.splice(index, 1);
            state.taskList.push(action.payload);
          }
        }
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.isDeleteSnackbarOpen = true;

        let index = state.allTaskList.findIndex(
          (task) => task._id === action.payload
        );

        if (index !== -1) {
          state.allTaskList.splice(index, 1);
        }

        index = state.taskList.findIndex((task) => task._id === action.payload);

        if (index !== -1) {
          state.taskList.splice(index, 1);
        }

        if (index === -1) {
          index = state.completedTaskList.findIndex(
            (task) => task._id === action.payload
          );
          if (index !== -1) {
            state.completedTaskList.splice(index, 1);
          }
        }

        if (index === -1) {
          index = state.skippedTaskList.findIndex(
            (task) => task._id === action.payload
          );
          if (index !== -1) {
            state.skippedTaskList.splice(index, 1);
          }
        }

        if (index === -1) {
          index = state.failedTaskList.findIndex(
            (task) => task._id === action.payload
          );
          if (index !== -1) {
            state.failedTaskList.splice(index, 1);
          }
        }
      })
      .addCase(markSkipped.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(markSkipped.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        let index = state.taskList.findIndex(
          (task) => task._id === action.payload._id
        );

        if (index !== -1) {
          state.taskList.splice(index, 1);
        }

        state.skippedTaskList.push(action.payload);
      })
      .addCase(markFailed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(markFailed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        let index = state.taskList.findIndex(
          (task) => task._id === action.payload._id
        );

        if (index !== -1) {
          state.taskList.splice(index, 1);
        }

        state.failedTaskList.push(action.payload);
      });
  },
});

export const {
  setShowAllTasks,
  setSelectedTaskId,
  updateCheckmarkProgress,
  setIsDeleteSnackbarOpen,
  setIsCompletionSnackbarOpen,
} = tasksSlice.actions;

export default tasksSlice.reducer;
