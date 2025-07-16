import mongoose from "mongoose";

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
  },
  { _id: false }
);

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

dailyQuestSetSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyQuestSet = mongoose.model("DailyQuestSet", dailyQuestSetSchema);
export default DailyQuestSet;
