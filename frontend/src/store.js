import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./features/tasksSlice";
import metricsReducer from "./features/metricsSlice";
import marketSlice from "./features/marketSlice";
import inventorySlice from "./features/inventorySlice";
import timerSlice from "./features/timerSlice";
import roomSlice from "./features/roomSlice";
import friendsSlice from "./features/friendsSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    metrics: metricsReducer,
    market: marketSlice,
    inventory: inventorySlice,
    timer: timerSlice,
    room: roomSlice,
    friends: friendsSlice
  },
});
