import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
  name: String,
  description: String,
  reward: Number,
  image: String,
});

const Quest = mongoose.model("Quest", questSchema);
export default Quest;
