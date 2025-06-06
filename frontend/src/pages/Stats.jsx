import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import VisualInsight from "../components/stats/VisualInsight";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

export default function Stats() {
  const { hoursSpent, tasksCompleted, categoryHours } = useSelector(
    (state) => state.metrics
  );

  const [selectedChart, setSelectedChart] = useState("hours");

  const handleChartChange = (event) => {
    setSelectedChart(event.target.value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ alignSelf: "center" }}>
        My Metrics
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            overflowX: "auto",
            width: "100%",
          }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            Weekly Overview
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="chart-select-label">View Chart</InputLabel>
            <Select
              labelId="chart-select-label"
              id="chart-select"
              value={selectedChart}
              label="View Chart"
              onChange={handleChartChange}
            >
              <MenuItem value="hours">Hours Spent This Week</MenuItem>
              <MenuItem value="tasks">Tasks Completed</MenuItem>
            </Select>
          </FormControl>

          {selectedChart === "hours" && (
            <VisualInsight
              title="Hours Spent This Week"
              chartLabel="Hours"
              chartData={categoryHours}
            />
          )}

          {selectedChart === "tasks" && (
            <VisualInsight
              title="Tasks Completed"
              chartLabel="Tasks"
              chartData={{
                "This Week": tasksCompleted["This Week"],
                "Last Week": tasksCompleted["Last Week"],
              }}
            />
          )}
        </Paper>

        {Object.entries(categoryHours).map(([category, hours]) => (
          <Paper
            sx={{
              p: 2,
              flexGrow: 1,
              borderRadius: 3,
              mb: 2,
              display: "flex",
              width: "100%",
            }}
          >
            <CheckCircleOutlineOutlinedIcon
              sx={{
                "margin-right": 5,
              }}
            />
            <Typography key={category} variant="body1">
              You have {category.toLowerCase()} for {hours} hours this week
            </Typography>
          </Paper>
        ))}

        <Paper
          sx={{
            p: 2,
            flexGrow: 1,
            borderRadius: 3,
            mb: 2,
            display: "flex",
          }}
        >
          <CheckCircleOutlineOutlinedIcon
            sx={{
              "margin-right": 5,
            }}
          />
          <Typography variant="body1">
            You have exercised 25% more this week!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
