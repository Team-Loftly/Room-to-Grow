import { Card, CardMedia, Typography } from "@mui/material";

export default function ItemTile({ id }) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        bgcolor: "grey.100",
        borderRadius: 4,
        m: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          p: 1,
          wordBreak: "break-word",
        }}
      >
        Furniture {id}
      </Typography>
      <CardMedia
        component="img"
        image="/furniture_placeholder.jpg"
        alt="Furniture Item"
        sx={{
          height: "60%",
          objectFit: "cover",
        }}
      />
    </Card>
  );
}
