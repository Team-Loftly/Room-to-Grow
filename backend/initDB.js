import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import User from "./src/models/Users.js";
import Decorations from "./src/models/Decorations.js";
import Rooms from "./src/models/Rooms.js";
import Quests from "./src/models/Quest.js";
import connectDB from "./src/connectDB.js";

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
  console.log(`Cleared ${collectionName}`);
};

// Drop any index that matches a nested field path (e.g., "decorations.decorId")
const dropIndexesMatching = async (Model, fieldPath) => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  const collectionExists = collections.some(
    (col) => col.name === Model.collection.name
  );

  if (!collectionExists) {
    console.warn(
      `Collection "${Model.collection.name}" does not exist. Skipping index drop.`
    );
    return;
  }

  const indexes = await Model.collection.indexes();
  for (const index of indexes) {
    const keys = Object.keys(index.key);
    if (keys.includes(fieldPath)) {
      await Model.collection.dropIndex(index.name);
      console.log(`Dropped index on "${fieldPath}": ${index.name}`);
    }
  }
};

// Optional check for duplicate decorIds inside a single room
const hasDuplicateDecorIds = (decorations) => {
  const ids = decorations.map((d) => d.decorId.toString());
  return new Set(ids).size !== ids.length;
};

const loadAndInsertData = async (
  filePath,
  Model,
  collectionName,
  checkDuplicates = false
) => {
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

    if (checkDuplicates && Array.isArray(dataToInsert)) {
      for (const item of dataToInsert) {
        if (hasDuplicateDecorIds(item.decorations)) {
          console.warn(`Duplicate decorId found in room ${item._id}`);
        }
      }
    }

    if (Array.isArray(dataToInsert)) {
      await Model.insertMany(dataToInsert);
    } else {
      await Model.create(dataToInsert);
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
    // Clear collections
    await clearCollection(User, "users");
    await clearCollection(Decorations, "decorations");
    await clearCollection(Quests, "quests");
    await clearCollection(Rooms, "rooms");

    // Drop any index on decorations.decorId to prevent conflicts
    await dropIndexesMatching(Rooms, "decorations.decorId");

    // Seed data
    await loadAndInsertData(
      "./src/data/decorations.json",
      Decorations,
      "decorations"
    );
    await loadAndInsertData("./src/data/quests.json", Quests, "quests");
    await loadAndInsertData("./src/data/users.json", User, "users");
    await loadAndInsertData("./src/data/rooms.json", Rooms, "rooms", true); // check for duplicates
  } catch (error) {
    console.error("An error occurred during the seeding process:", error);
  } finally {
    process.exit();
  }
};

seed();
