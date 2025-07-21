import mongoose from "mongoose";

// Sub-schema for for each of a user's daily quests
const dailyQuestSchema = new mongoose.Schema(
  {
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quest",
      required: true,
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
    progress: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

// Schema for a user's set of daily quests
const dailyQuestSetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  isComplete: {
    type: Boolean,
    required: true,
    default: false,
  },
  isRewardClaimed: {
    type: Boolean,
    required: true,
    default: false,
  },
  quests: [dailyQuestSchema],
});

// Each user has at most one daily quest set per day
dailyQuestSetSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyQuestSet = mongoose.model("DailyQuestSet", dailyQuestSetSchema);
export default DailyQuestSet;
