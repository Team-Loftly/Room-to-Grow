import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    furnitureList: [
      {
        model: "DeskChair1",
        position: [-5, 0, -5],
        rotation: [0, Math.PI, 0],
        scale: [65, 65, 65],
      },
      {
        model: "WarpPipe",
        position: [-10, 0, 10],
        rotation: [0, Math.PI, 0],
        scale: [6, 6, 6],
      },
    ],
  },
  reducers: {},
});

export const {} = roomSlice.actions;
export default roomSlice.reducer;
