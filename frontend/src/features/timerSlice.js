import { createSlice } from "@reduxjs/toolkit";

const timerSlice = createSlice({
  name: "timer",
  initialState: {
    timeLeft: 0,
    isRunning: false,
  },
  reducers: {
    setTimer: (state, action) => {
      state.timeLeft = action.payload;
      state.isRunning = false;
    },
    startTimer: (state) => {
      state.isRunning = true;
    },
    stopTimer: (state) => {
      state.isRunning = false;
    },
    tick: (state) => {
      if (state.isRunning && state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
  },
});

export const { setTimer, startTimer, stopTimer, tick } =
  timerSlice.actions;
export default timerSlice.reducer;
