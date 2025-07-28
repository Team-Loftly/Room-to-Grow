import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Popover,
  Paper,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { setSelectedDate, fetchTasks } from "../../../features/tasksSlice";

export default function DatePickerButton() {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.tasks.selectedDate);
  const showAllTasks = useSelector((state) => state.tasks.showAllTasks);
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    dispatch(setSelectedDate(newDate));
    dispatch(fetchTasks(newDate));
    handleClose();
  };

  const formatDisplayDate = (date) => {
    const today = new Date();
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return "Today";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  const open = Boolean(anchorEl);

  // Don't show date picker when viewing all tasks
  if (showAllTasks) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Button
        onClick={handleButtonClick}
        startIcon={<CalendarTodayIcon />}
        sx={{
          color: "text.primary",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "2.125rem",
          padding: 0,
          minWidth: "auto",
          "&:hover": {
            backgroundColor: "transparent",
            color: "primary.main",
          },
          "& .MuiButton-startIcon": {
            marginRight: 1,
            "& svg": {
              fontSize: "1.5rem",
            },
          },
        }}
      >
        {formatDisplayDate(selectedDate)}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Paper sx={{ p: 1 }}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            sx={{
              "& .MuiPickersDay-root": {
                borderRadius: 1,
              },
            }}
          />
        </Paper>
      </Popover>
    </LocalizationProvider>
  );
}
