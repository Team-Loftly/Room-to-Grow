import { Box, Card, Typography, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDailyQuests,
  selectDailyQuests,
  selectDailyQuestsStatus,
  selectDailyQueststError,
} from "../features/dailyQuestSetSlice";
import { useEffect } from "react";

export default function Quests() {
  const dispatch = useDispatch();
  const dailyQuests = useSelector(selectDailyQuests);
  const status = useSelector(selectDailyQuestsStatus);
  const error = useSelector(selectDailyQueststError);

  // fetch daily quests on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDailyQuests());
    }
  }, [dispatch, status]);

  if (status === "loading" || status === "idle") {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Typography>Loading Daily Quests...</Typography>
      </Stack>
    );
  }

  if (status === "failed") {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Typography color="error">Error: {error}</Typography>
      </Stack>
    );
  }

  if (!dailyQuests) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Typography>No daily quests available for today.</Typography>
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          width: "90%",
          height: "90%",
          bgcolor: "rgba(255,255,255,0.8)",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ width: "100%" }}
        >
          Daily Quests
        </Typography>
        {dailyQuests.quests && dailyQuests.quests.length > 0 ? (
          dailyQuests.quests.map((questItem) => (
            <Box key={questItem.questId._id} sx={{ marginBottom: 2 }}>
              <Typography>
                {questItem.questId.name}
                <br />
                {questItem.questId.description}
                <br />
                {questItem.questId.reward} Coins <br /> Status:{" "}
                {questItem.isComplete ? "Complete" : "Incomplete"}{" "}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography align="center" sx={{ marginTop: 2 }}>
            No individual quests found for today.
          </Typography>
        )}
        <Typography>
          Complete all three quests to receive a bonus of {dailyQuests.reward}{" "}
          coins
        </Typography>
      </Card>
    </Box>
  );
}
