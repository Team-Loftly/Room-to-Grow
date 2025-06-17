import { createSlice } from "@reduxjs/toolkit";

// placeholder items for now
// TODO: replace these with items from DB later on
// items have a source image, price, name, description, category
const initialState = {
    selectedItem : { // the item currently selected on the market page
        name: "Mystical Lava Lamp",
        description: "A mystical lava lamp with an eerie glow.",
        price: 100,
        category: "Desk Decorations",
        image: "./images/lavalamp-dark.png"
    },
    items : [
        {
            name: "Mystical Lava Lamp",
            description: "A mystical lava lamp with an eerie glow.",
            price: 100,
            category: "Desk Decorations",
            image: "./images/lavalamp-dark.png"
        },
        {
            name: "The Supernova",
            description: "A beautiful space-themed wall painting.",
            price: 200,
            category: "Wall Decorations",
            image: "./images/supernova.png"
        }, 
        {
            name: "Classy TV",
            description: "A classy looking TV complete with a set of retro games- don't play too long!",
            price: 500,
            category: "Furniture",
            image: "./images/tv.png"
        }, 
        {
            name: "Cheery Lava Lamp",
            description: "A cheerful lava lamp with a bright glow that warms your heart.",
            price: 100,
            category: "Desk Decorations",
            image: "./images/lavalamp-bright.png"
        },
        {
            name: "The Blackhole",
            description: "A stunning wall painting depicting a black hole.",
            price: 200,
            category: "Wall Decorations",
            image: "./images/blackhole.png"
        },
        {
            name: "Flat Screen TV",
            description: "A bright flat screen TV. Comes equipped with a modern gaming system.",
            price: 800,
            category: "Furniture",
            image: "./images/tv-modern.png"
        }
    ]
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
        state.selectedItem = action.payload;
      },
  },
});

export const { setSelectedItem } = marketSlice.actions;

export const selectMarketItems = (state) => state.market.items;
export const selectSelectedItem = (state) => state.market.selectedItem;

export default marketSlice.reducer;
