// tracks user inventory of items
// tracks user number of coins
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coins: 2000,
  inventory: [
    {
      name: "Mystical Lava Lamp",
      description: "A mystical lava lamp with an eerie glow.",
      price: 100,
      category: "Desk Decorations",
      image: "./images/lavalamp-dark.png",
    },
  ],
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addCoins: (state, action) => {
      state.coins += action.payload;
    },
    spendCoins: (state, action) => {
      if (state.coins >= action.payload) {
        state.coins -= action.payload;
      }
    },
    addItem: (state, action) => {
      state.inventory.push(action.payload);
    },
    removeItem: (state, action) => {
      state.inventory = state.inventory.filter(
        (item) => item.name !== action.payload
      );
    },
  },
});

export const { addCoins, spendCoins, addItem, removeItem } = inventorySlice.actions;

export const selectInventoryItems = (state) => state.inventory.inventory;
export const selectInventoryCoins = (state) => state.inventory.coins;

export default inventorySlice.reducer;
