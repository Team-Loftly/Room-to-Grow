import { configureStore } from "@reduxjs/toolkit";
import tasksSlice from "./features/tasksSlice";
import metricsReducer from "./features/metricsSlice";
import marketSlice from "./features/marketSlice";
import inventorySlice from "./features/inventorySlice";

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    metrics: metricsReducer,
    market: marketSlice,
    inventory: inventorySlice
  },
});
