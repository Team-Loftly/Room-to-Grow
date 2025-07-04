import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStats } from "../../../features/metricsSlice";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import TaskStatCard from "./TaskStatCard";
import VisualInsight from "../../stats/VisualInsight";
import DoneIcon from "@mui/icons-material/Done";
import TasksRightPageToolBar from "./TasksRightPageToolbar";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const BASE_API_URL = import.meta.env.VITE_APP_API_URL;

export default function SelectedTask() {
  const selectedTaskId = useSelector((state) => state.tasks.selectedTaskId);
  const [habitStats, setHabitStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedTaskId || selectedTaskId === -1) {
        setHabitStats(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication token missing. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${BASE_API_URL}/habits/${selectedTaskId}/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHabitStats(response.data);
      } catch (err) {
        console.error("Failed to fetch habit statistics:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching statistics."
        );
        setHabitStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedTaskId]);

  if (selectedTaskId === -1) {
    return (
      <Box
        sx={{
          width: "90%",
          height: "90%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          marginTop: 4,
          p: 2,
          borderRadius: 3,
          bgcolor: "transparent",
        }}
      >
        <TasksRightPageToolBar selected_task_name="Select a Habit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: "90%",
          height: "90%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          marginTop: 4,
          p: 2,
          borderRadius: 3,
          bgcolor: "transparent",
        }}
      >
        <TasksRightPageToolBar selected_task_name="Select a Habit" />
        <Typography variant="body1">
          Ran into error loading selected habitat: {error}
        </Typography>
      </Box>
    );
  }

  if (loading || habitStats === null) {
    return (
      <Box
        sx={{
          width: "90%",
          height: "90%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          marginTop: 4,
          p: 2,
          borderRadius: 3,
          bgcolor: "transparent",
        }}
      >
        <TasksRightPageToolBar selected_task_name="" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "90%",
        height: "90%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        marginTop: 4,
        p: 2,
        borderRadius: 3,
        bgcolor: "transparent",
      }}
    >
      <TasksRightPageToolBar selected_task_name={habitStats.title} />

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <TaskStatCard
          stat_icon={WhatshotIcon}
          stat_icon_color="orange"
          stat_text={`Current Streak: ${habitStats.currentStreak} days`}
        />
        <Paper
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "stretch",
            bgcolor: "transparent",
            boxShadow: "none",
            gap: 2,
          }}
        >
          <TaskStatCard
            card_width="50%"
            stat_icon={DoneIcon}
            stat_icon_color="green"
            stat_text={`Total Completions: ${habitStats.completedDays} days`}
          />
          <TaskStatCard
            card_width="50%"
            stat_icon={ClearIcon}
            stat_icon_color="red"
            stat_text={`Total Failed: ${habitStats.failedDays} days`}
          />
        </Paper>

        <Paper
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "stretch",
            bgcolor: "transparent",
            boxShadow: "none",
            gap: 2,
          }}
        >
          <TaskStatCard
            card_width="50%"
            stat_icon={ArrowForwardIcon}
            stat_text={`Total Skipped: ${habitStats.skippedDays} days`}
          />
          <TaskStatCard
            card_width="50%"
            stat_icon={TrendingUpIcon}
            stat_text={`Total: ${habitStats.totalValue} ${habitStats.type === "checkmark" ? "times" : "min"}`}
          />
        </Paper>

        {/* 
        
        ================== METRICS, UPDATE =========================================
        
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
        </Paper> */}
      </Box>
    </Box>
  );
}
