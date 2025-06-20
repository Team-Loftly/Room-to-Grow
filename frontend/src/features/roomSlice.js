import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    furniture: {
      deskChair1: {
        model: "DeskChair1",
        position: [-5, -12, -5],
        rotation: [0, Math.PI, 0],
        scale: [65, 65, 65],
      },
    },
  },
  reducers: {},
});

export const {} = roomSlice.actions;
export default roomSlice.reducer;
