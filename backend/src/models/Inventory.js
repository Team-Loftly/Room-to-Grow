import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coins: Number,
  decorations: [{ // list of the ids of the decoration items
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Decorations' // reference to the Decorations model
  }]
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;