import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Typography } from "@mui/material";

export default function AddTaskButton() {
  const handleClick = () => {
    // !!! TODO;
  };

  return (
    <Box>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#1E2939",
          color: "white",
          fontWeight: "bold",
          width: "100%",
          height: 20,
          borderRadius: 3,
          p: 2,
          display: "flex",
          justifyContent: "center",
        }}
        onClick={() => {
          handleClick();
        }}
      >
        <Typography>Add Task</Typography>
        <AddIcon />
      </Button>
    </Box>
  );
}
