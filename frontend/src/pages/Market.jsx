import { Stack, Box, Paper, Divider, Typography } from "@mui/material";

function Market() {
  return (
    <Stack
      direction="row"
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: "black", borderWidth: "1px" }}
        />
      }
      sx={{
        height: "100%",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "grey.100",
          m: 3,
        }}
      >
        <Typography variant="h4">Left Component</Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "grey.200",
          m: 3,
        }}
      >
        <Typography variant="h4">Right Component</Typography>
      </Box>
    </Stack>
  );
}

export default Market;
