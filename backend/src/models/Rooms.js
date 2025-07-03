import mongoose from "mongoose";

// TODO: need to validate that position, rotation, and scale are arrays of exactly 3 numbers
const roomDecorSchema = new mongoose.Schema({
  decorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Decorations",
    required: true,
  },
  placed: {
    type: Boolean,
    required: true,
    default: false, // default to false if not specified
  },
  position: {
    type: [Number],
    required: true,
  },
  rotation: {
    type: [Number],
    required: true,
  },
  scale: {
    type: [Number],
    required: false, // scale is optional
  },
});

const roomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  decorations: [roomDecorSchema],
});

const Rooms = mongoose.model("Rooms", roomSchema);
export default Rooms;
