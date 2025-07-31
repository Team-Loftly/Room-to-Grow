import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  friends: {
    type: [String]
  },
  friendRequests: { // requests you have received that you can approve/ delete
    type: [String]
  }
});

const User = mongoose.model("User", userSchema);
export default User;
