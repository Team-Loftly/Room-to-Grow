import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import TaskCard from "./TaskCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../../../features/tasksSlice";
import { Typography } from "@mui/material";
import AccordionTasks from "./AccordionTasks";

export default function TaskCardList() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.taskList);
  const completed_tasks = useSelector((state) => state.tasks.completedTaskList);
  const skipped_tasks = useSelector((state) => state.tasks.completedTaskList);
  const failed_tasks = useSelector((state) => state.tasks.completedTaskList);
  const status = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  if (error) {
    return <Typography>Error fetching habits: {error}</Typography>;
  }

  const isLoading = status === "loading";

  return (
    <>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          Loading habits...
        </Typography>
      ) : tasks.length > 0 ? (
        <Stack
          direction="column"
          spacing={2}
          sx={{
            p: 2, // Add padding inside the Stack for content spacing
          }}
        >
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No habits left to complete today.
        </Typography>
      )}

      {completed_tasks.length > 0 && (
        <AccordionTasks
          tasks={completed_tasks}
          accordion_title={"Completed"}
        ></AccordionTasks>
      )}

      {skipped_tasks.length > 0 && (
        <AccordionTasks
          tasks={skipped_tasks}
          accordion_title={"Skipped"}
        ></AccordionTasks>
      )}

      {failed_tasks.length > 0 && (
        <AccordionTasks
          tasks={failed_tasks}
          accordion_title={"Failed"}
        ></AccordionTasks>
      )}
    </>
  );
}
