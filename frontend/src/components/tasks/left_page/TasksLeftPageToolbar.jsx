import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import { Typography, Box, Button, IconButton, Tooltip } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { useSelector, useDispatch } from "react-redux";

import CreateTask from "./CreateTask";
import DatePickerButton from "./DatePickerButton";
import { setShowAllTasks } from "../../../features/tasksSlice";
import SortButton from "./SortButton";
import FilterButton from "./filterButton";

export default function TasksLeftPageToolBar() {
  const showAllTasks = useSelector((state) => state.tasks.showAllTasks);
  const dispatch = useDispatch();

  const [openTools, setOpenTools] = React.useState(false);
  const [renderToolsContent, setRenderToolsContent] = React.useState(true);

  React.useEffect(() => {
    setRenderToolsContent(openTools);
  }, []);

  const handleToggleTools = () => {
    setOpenTools((prev) => !prev);
    setRenderToolsContent(false);
  };

  const handleEntered = () => {
    setRenderToolsContent(true);
  };

  const handleExited = () => {
    setRenderToolsContent(true);
  };

  return (
    <Toolbar
      sx={{
        bgcolor: "transparent",
        borderBottom: "1px solid rgb(0, 0, 0)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{ flexGrow: 1, display: "flex", alignItems: "center", minWidth: 0 }}
      >
        {showAllTasks ? (
          <Typography
            variant="h4"
            sx={{
              ml: -1.2,
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            All Habits
          </Typography>
        ) : (
          <DatePickerButton />
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mr: -1.2,
          flexShrink: 1,
        }}
      >
        <Tooltip
          key={openTools ? "tools-expanded" : "tools-collapsed"} // rerender tooltip to prevent expand from showing after clicking minimize
          title={openTools ? "Minimize" : "Expand"}
        >
          <IconButton
            onClick={handleToggleTools}
            aria-label={openTools ? "Hide tools" : "Show tools"}
            sx={{ color: "black", mr: 1 }}
          >
            {openTools ? (
              <KeyboardDoubleArrowRightIcon />
            ) : (
              <KeyboardDoubleArrowLeftIcon />
            )}
          </IconButton>
        </Tooltip>
        <Collapse
          orientation="horizontal"
          in={openTools}
          onEntered={handleEntered}
          onExited={handleExited}
          timeout={0}
        >
          {renderToolsContent && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                minWidth: "280px",
                flexShrink: 1,
              }}
            >
              <Tooltip
                title={showAllTasks ? "Show Today's Habits" : "Show All Habits"}
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
                    textTransform: "none",
                  }}
                >
                  {showAllTasks ? "Today" : "All"}
                </Button>
              </Tooltip>
              <SortButton />
              <FilterButton />
              <CreateTask />
            </Box>
          )}
        </Collapse>
      </Box>
    </Toolbar>
  );
}
