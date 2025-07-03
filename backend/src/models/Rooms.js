const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: need to validate that position, rotation, and scale are arrays of exactly 3 numbers
const roomDecorSchema = new Schema({
  decorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Decorations",
    required: true,
  },
  model: {
    type: String,
    required: true,
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
    required: true,
  },
});

const roomSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  decorations: [roomDecorSchema],
});

module.exports = mongoose.model("Rooms", roomSchema);
