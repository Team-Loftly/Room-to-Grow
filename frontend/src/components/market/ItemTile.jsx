import { Card, CardMedia, Typography } from "@mui/material";

export default function ItemTile({ item, selected, onSelect }) {
  return (
    <Card
      onClick={onSelect}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        bgcolor: "grey.100",
        borderRadius: 4,
        m: 2,
        width: 200,
        cursor: "pointer",
        border: selected ? "2px solid #1976d2" : "2px solid transparent",
        boxShadow: selected ? 4 : 1,
        transition: "border 0.2s, box-shadow 0.2s",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          p: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
          textAlign: "center",
        }}
      >
        {item.name}
      </Typography>
      <CardMedia
        component="img"
        image={item.image}
        alt="Furniture Item"
        sx={{
          height: 200,
          width: 200,
          objectFit: "cover",
          borderRadius: 2,
        }}
      />
      <Typography variant="b2">
        {item.category}
      </Typography>
    </Card>
  );
}
