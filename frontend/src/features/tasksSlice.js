import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskList: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      console.log("Reducer hit with payload:", action.payload);
      state.taskList.push(action.payload);
    },
  },
});

export const { addTask } = tasksSlice.actions;

export const selectTaskList = (state) => state.tasks.taskList;

export default tasksSlice.reducer;
