import { Box, Button, Typography, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDailyQuests,
  claimDailyQuestReward,
  selectDailyQuests,
  selectDailyQuestsStatus,
  selectDailyQueststError,
  clearQuestNotification,
} from "../features/dailyQuestSetSlice";
import { useEffect } from "react";
import iconMap from "../components/quests/IconMap";
import React from "react";

export default function Quests() {
  const dispatch = useDispatch();
  const dailyQuests = useSelector(selectDailyQuests);
  const status = useSelector(selectDailyQuestsStatus);
  const error = useSelector(selectDailyQueststError);

  const BONUS_SOUND_PATH = "/audio/daily-bonus.mp3";
  const bonusSound = new Audio(BONUS_SOUND_PATH);

  // Clear the notification dot when the Quests component mounts
  useEffect(() => {
    dispatch(clearQuestNotification());
  }, [dispatch]);

  // fetch daily quests on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDailyQuests());
    }
  }, [dispatch, status]);

  const handleClaimReward = async () => {
    try {
      bonusSound.volume = 0.5;
      await bonusSound.play();
    } catch (error) {
      console.warn("Audio play failed:", error);
    }

    dispatch(claimDailyQuestReward(dailyQuests._id));
  };

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
    <Stack
      direction="column"
      spacing={8}
      sx={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        p: 8,
      }}
    >
      <Box
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: 4,
          width: "75%",
          height: "100%",
          p: 5,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.8)",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Daily Quests
          </Typography>
          <Typography>
            Complete all three daily quests to receive a bonus of 25 coins!
          </Typography>
          <Button
            onClick={handleClaimReward}
            disabled={!dailyQuests.isComplete || dailyQuests.isRewardClaimed}
            sx={{
              marginTop: "12px",
              p: 2,
              backgroundColor: "#0a571f",
              color: "white",
              borderRadius: "5px",
              fontSize: "17px",
              "&.Mui-disabled": {
                backgroundColor: "#a0a0a0",
                color: "black",
              },
            }}
          >
            {!dailyQuests.isComplete && (
              <Typography>Complete All Quests to Unlock!</Typography>
            )}
            {dailyQuests.isComplete && !dailyQuests.isRewardClaimed && (
              <Typography>Click Here to Redeem Daily Bonus!</Typography>
            )}
            {dailyQuests.isComplete && dailyQuests.isRewardClaimed && (
              <Typography>Daily Bonus Redeemed</Typography>
            )}
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
          }}
        >
        <Stack
          spacing={8}
          direction="row"
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          {dailyQuests.quests && dailyQuests.quests.length > 0 ? (
            dailyQuests.quests.map((questItem) => {
              const IconComponent = iconMap[questItem.questId.image];
              return (
                <Box
                  key={questItem.questId._id}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 4,
                    width: "100%",
                    opacity: questItem.isComplete ? 0.5 : 1,
                    overflowY: "auto",
                  }}
                >
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ width: "100%", p: 2 }}
                  >
                  {questItem.questId.name}
                </Typography>
                {IconComponent && (
                  <IconComponent
                    align="center"
                    sx={{ width: "100%", color: "#0a571f", fontSize: 40 }}
                  />
                )}
                <Typography align="center" sx={{ width: "100%", p: 2 }}>
                  {questItem.questId.description} <br />
                  Reward: {questItem.questId.reward} Coins <br />
                  Status: {questItem.isComplete
                    ? "Complete"
                    : "Incomplete"}{" "}
                  <br />
                  Progress: {questItem.progress} out of{" "}
                  {questItem.questId.targetValue}
                  <br />
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography align="center" sx={{ marginTop: 2 }}>
            No individual quests found for today.
          </Typography>
        )}
        </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
