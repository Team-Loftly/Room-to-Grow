import fs from "fs";
import path from "path";
import User from "./src/models/Users.js";
import Decorations from "./src/models/Decorations.js";
import Inventory from "./src/models/Inventory.js";
import connectDB from "./src/connectDB.js";

const seed = async () => {
  await connectDB();

  // clear saved users in the database
  await User.deleteMany();
  console.log("cleared registered users");

  // clear saved inventories in the database
  await Inventory.deleteMany();
  console.log("cleared created inventories");

  // add items to the decorations collection
  await Decorations.deleteMany();
  console.log("cleared saved decorations");

  // Load decorations
  const filePath = path.resolve("./src/data/decorations.json");
  const rawData = fs.readFileSync(filePath);
  const { items } = JSON.parse(rawData);

  // Insert decorations into DB
  await Decorations.insertMany(items);
  console.log("Seeded decorations");

  process.exit();
};

seed();
