import { Typography, Paper } from "@mui/material";

export default function TaskStatCard({
  card_width,
  stat_icon: IconComponent,
  stat_icon_color,
  stat_text,
}) {
  return (
    <Paper
      sx={{
        p: 2,
        flexGrow: 1,
        borderRadius: 3,
        mb: 2,
        display: "flex",
        ...(card_width && { width: card_width }),
      }}
    >
      {IconComponent && (
        <IconComponent
          sx={{
            marginRight: 2,
            ...(stat_icon_color && { color: stat_icon_color }),
          }}
        />
      )}
      <Typography variant="body1">{stat_text}</Typography>
    </Paper>
  );
}
