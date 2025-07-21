import { createSlice } from '@reduxjs/toolkit';

const sortFilterSlice = createSlice({
  name: 'sortFilter',
  initialState: {
    sortBy: 'default',
    sortDirection: 'asc',
    filterBy: 'default',
  },
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action) => {
      state.sortDirection = action.payload;
    },
    setSortOptions: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
    setFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
  },
});

export const { setSortBy, setSortDirection, setSortOptions, setFilterBy } = sortFilterSlice.actions;
export default sortFilterSlice.reducer;