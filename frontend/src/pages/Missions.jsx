import { Box, Card, Typography } from "@mui/material";

export default function Missions() {
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
          Test
        </Typography>
      </Card>
    </Box>
  );
}
