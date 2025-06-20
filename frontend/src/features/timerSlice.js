import { createSlice } from "@reduxjs/toolkit";

const timerSlice = createSlice({
  name: "timer",
  initialState: {
    timeLeft: 0,
    showTimer: false,
    isRunning: false,
  },
  reducers: {
    openTimer: (state) => {
      state.showTimer = true;
    },
    closeTimer: (state) => {
      state.showTimer = false;
    },
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

export const { openTimer, closeTimer, setTimer, startTimer, stopTimer, tick } =
  timerSlice.actions;
export default timerSlice.reducer;
