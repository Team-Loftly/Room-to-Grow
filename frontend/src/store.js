import { configureStore } from "@reduxjs/toolkit";
import tasksSlice from "./features/tasksSlice";
import metricsReducer from "./features/metricsSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    metrics: metricsReducer,
  },
});
