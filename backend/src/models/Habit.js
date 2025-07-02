import mongoose from "mongoose";

// Sub-schema for daily status entries
const dailyStatusEntrySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["incomplete", "complete", "skipped", "failed"],
      required: true,
    },
    value: {
      type: Number, // For "timed": minutes completed, For "checkmark": count completed
      required: true,
      default: 0,
    },
    dayOfWeek: {
      type: String,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    days: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    priority: {
      type: Number,
      enum: [1, 2, 3], // 1: High, 2: Medium, 3: Low
      default: 2,
    },
    type: {
      type: String,
      enum: ["timed", "checkmark"],
      required: true,
    },
    hours: {
      type: Number,
      default: 0,
      min: 0,
    },
    minutes: {
      type: Number,
      default: 0,
      min: 0,
      max: 59,
    },
    checkmarks: {
      type: Number,
      default: 1,
      min: 1,
    },

    dailyStatuses: {
      type: [dailyStatusEntrySchema],
      default: [],
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastStreakUpdateDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
