import fs from "fs";
import path from "path";
import User from "./src/models/Users.js";
import Decorations from "./src/models/Decorations.js";
import Inventory from "./src/models/Inventory.js";
import Rooms from "./src/models/Rooms.js";
import connectDB from "./src/connectDB.js";
import mongoose from "mongoose";

// converts {$oid: "..."} into mongoose.Types.ObjectId
const mongoReviver = (key, value) => {
  if (
    value &&
    typeof value === "object" &&
    value.$oid &&
    typeof value.$oid === "string"
  ) {
    return new mongoose.Types.ObjectId(value.$oid);
  }
  return value;
};

const clearCollection = async (Model, collectionName) => {
  await Model.deleteMany();
  console.log(`Cleared saved ${collectionName}`);
};

// populates database with data from JSON files
const loadAndInsertData = async (filePath, Model, collectionName) => {
  try {
    const absolutePath = path.resolve(filePath);
    const rawData = fs.readFileSync(absolutePath, "utf8");
    const jsonData = JSON.parse(rawData, mongoReviver);

    let dataToInsert = jsonData;

    if (!dataToInsert || dataToInsert.length === 0) {
      console.warn(
        `No data found in ${filePath} for ${collectionName}. Skipping insertion.`
      );
      return;
    }

    // insertMany for arrays, create for single objects
    if (Array.isArray(dataToInsert)) {
      await Model.insertMany(dataToInsert);
    } else {
      await Model.create(dataToInsert); // single object insertion
    }
    console.log(`Seeded ${collectionName}`);
  } catch (error) {
    console.error(`Error seeding ${collectionName} from ${filePath}:`, error);
    process.exit(1);
  }
};

const seed = async () => {
  await connectDB();

  try {
    // clear collections
    await clearCollection(User, "registered users");
    await clearCollection(Inventory, "created inventories");
    await clearCollection(Decorations, "saved decorations");
    await clearCollection(Rooms, "saved rooms");

    // load and insert data
    await loadAndInsertData(
      "./src/data/decorations.json",
      Decorations,
      "decorations"
    );
    await loadAndInsertData("./src/data/users.json", User, "users");
    await loadAndInsertData(
      "./src/data/inventories.json",
      Inventory,
      "inventories"
    );
    await loadAndInsertData("./src/data/rooms.json", Rooms, "rooms");
  } catch (error) {
    console.error("An error occurred during the seeding process:", error);
  } finally {
    process.exit();
  }
};

seed();
