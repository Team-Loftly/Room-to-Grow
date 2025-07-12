import { Stack, Typography } from "@mui/material";

export default function Controls() {
  return (
    <Stack
      spacing={4}
      sx={{
        justifyContent: "center",
        ml: 5,
        color: "white",
      }}
    >
      <Typography style={{ margin: 0, fontWeight: "bold", fontSize: 25 }}>
        Controls
      </Typography>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          fontSize: "15px",
          mt: 1,
        }}
      >
        <div>
          <strong>Left click:</strong>
          <br />
          select/deselect item
        </div>
        <div>
          <strong>Move cursor:</strong>
          <br />
          reposition item
        </div>
        <div>
          <strong> ↑ & ↓ key:</strong>
          <br />
          raise/lower item
        </div>
        <div>
          <strong>← & → key:</strong>
          <br />
          rotate item
        </div>
      </Stack>
    </Stack>
  );
}
