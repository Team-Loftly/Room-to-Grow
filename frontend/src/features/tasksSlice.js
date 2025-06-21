import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskList: [
    {
      id: 214,
      title: "Cramming session",
      description: "Chapter 2.2",
      days: [],
      priority: 3,
      type: "timed",
      hours: 0,
      minutes: 30,
      checkmarks: null,
      progress: 0,
    },
    {
      id: 31,
      title: "Drink water",
      description: "Hydration is important!",
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      priority: 1,
      type: "checkmark",
      hours: null,
      minutes: null,
      checkmarks: 4,
      progress: 1,
    },
    {
      id: 100,
      title: "Piano practice",
      description: "Moonlight Sonata",
      days: ["Wednesday"],
      priority: 2,
      type: "timed",
      hours: 1,
      minutes: 0,
      checkmarks: null,
      progress: 30,
    },
  ],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.taskList.push(action.payload);
    },
    deleteTask: (state, action) => {
      console.log("Task deleted", action.payload);
      state.taskList = state.taskList.filter(
        (task) => task.id !== action.payload
      );
    },
    updateCheckmarkProgress: (state, action) => {
      const { taskId, progressMade } = action.payload;
      const task = state.taskList.find((t) => t.id == taskId);
      task.progress = task.progress + progressMade;
    },
  },
});

export const { addTask, deleteTask, updateCheckmarkProgress } =
  tasksSlice.actions;

export const selectTaskList = (state) => state.tasks.taskList;

export default tasksSlice.reducer;
