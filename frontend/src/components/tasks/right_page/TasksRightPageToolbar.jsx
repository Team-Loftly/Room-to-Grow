import Toolbar from "@mui/material/Toolbar";
import { Typography, Box } from "@mui/material";

// import CreateTask from "./CreateTask";

export default function TasksRightPageToolBar({ selected_task_name }) {
  return (
    <Toolbar
      sx={{
        bgcolor: "transparent",
        borderBottom: "1px solid rgb(0, 0, 0)",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {selected_task_name && (
        <Typography variant="h4" sx={{ ml: -1.2, fontWeight: 700 }}>
          {selected_task_name}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexdirection: "row",
          mr: -1.2,
        }}
      >
        {/* <CreateTask /> */}
      </Box>
    </Toolbar>
  );
}
