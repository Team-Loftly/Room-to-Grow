import mongoose from "mongoose";

const decorSchema = new mongoose.Schema({
  name: String,
  description: String,
  modelID: String, // import name of the 3D model
  price: Number,
  category: String,
  image: String, // path to the image
});

const Decorations = mongoose.model("Decorations", decorSchema);
export default Decorations;
