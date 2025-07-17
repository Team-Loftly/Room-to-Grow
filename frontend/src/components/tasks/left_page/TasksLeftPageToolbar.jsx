import Toolbar from "@mui/material/Toolbar";
import { Typography, Box, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import CreateTask from "./CreateTask";
import { setShowAllTasks } from "../../../features/tasksSlice";

export default function TasksLeftPageToolBar() {
  const showAllTasks = useSelector((state) => state.tasks.showAllTasks);
  const dispatch = useDispatch();

  return (
    <Toolbar
      sx={{
        bgcolor: "transparent",
        borderBottom: "1px solid rgb(0, 0, 0)",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4" sx={{ ml: -1.2, fontWeight: 700 }}>
        {showAllTasks ? "All Habits" : "Today"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexdirection: "row",
          mr: -1.2,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(setShowAllTasks(!showAllTasks));
          }}
          sx={{
            color: "black",
            borderColor: "black",
            mr: 2,
            "&:hover": {
              borderColor: "black",
              color: "black",
            },
          }}
        >
          {showAllTasks ? "Today's Habits" : "All Habits"}
        </Button>

        <CreateTask />
      </Box>
    </Toolbar>
  );
}
