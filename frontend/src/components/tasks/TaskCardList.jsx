import Stack from "@mui/material/Stack";
import TaskCard from "./TaskCard";

export default function TaskCardList({ tasks }) {
  return (
    <Stack direction="column" spacing={2}>
      {tasks.map((task) => (
        <Stack key={task.id}>
          <TaskCard task={task} />
        </Stack>
      ))}
    </Stack>
  );
}
