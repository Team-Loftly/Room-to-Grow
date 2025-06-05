import { createSlice } from "@reduxjs/toolkit";

const metricsSlice = createSlice({
	name: "metrics",
	initialState: {
		hoursSpent: {
			"This Week": 10,
			"Last Week": 5,
			Total: 20,
		},
		tasksCompleted: {
			"This Week": 20,
			"Last Week": 10,
			Total: 50,
		},

		categoryHours: {
			Coded: 4,
			Read: 6,
			Exercised: 2,
			"Played Piano": 10,
		},
	},
	reducers: {
		incrementHours: (state, action) => {
			const { category, hours } = action.payload;
			if (state.categoryHours[category] !== undefined) {
				state.categoryHours[category] += hours;
			}
			state.hoursSpent["This Week"] += hours;
			state.hoursSpent["Total"] += hours;
		},

		completeTask: (state, action) => {
			state.tasksCompleted["This Week"] += 1;
			state.tasksCompleted["Total"] += 1;
		},

		resetWeeklyMetrics: (state) => {
			state.hoursSpent["This Week"] = 0;
			state.tasksCompleted["This Week"] = 0;
		},
	},
});

export const { incrementHours, completeTask, resetWeeklyMetrics } =
	metricsSlice.actions;

export default metricsSlice.reducer;
