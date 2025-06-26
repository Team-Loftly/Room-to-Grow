import User from './src/models/Users.js';
import connectDB from './src/connectDB.js';

const seed = async () => {
  await connectDB();

  // clear saved users in the database
  await User.deleteMany();
  console.log("cleared registered users");
  process.exit();
};

seed();
