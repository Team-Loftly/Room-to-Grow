import { Card, CardMedia, Typography } from "@mui/material";

export default function ItemTile({ id }) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        bgcolor: "grey.100",
        borderRadius: 10,
        m: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: 50,
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
