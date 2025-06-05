import { configureStore } from "@reduxjs/toolkit";
import taskSlice from "./slices/taskSlice";
import metricsReducer from "./slices/metricsSlice";

export const store = configureStore({
  reducer: {
    tasks: taskSlice,
    metrics: metricsReducer,
  },
});
