import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskList: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.taskList.push(action.payload);
    },
    removeTask: (state, action) => {
      // TODO
    },
  },
});

export const { addTask, removeTask } = taskSlice.actions;

export const selectTaskList = (state) => state.tasks.taskList;

export default taskSlice.reducer;
