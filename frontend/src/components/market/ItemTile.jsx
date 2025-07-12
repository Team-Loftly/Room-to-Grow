import { Card, CardMedia, Typography } from "@mui/material";

export default function ItemTile({
  item,
  selected,
  onSelect,
  isMarketplace = true,
}) {
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
        px: 2,
        width: 200,
        cursor: "pointer",
        border: selected ? "3px solid #0a571f" : "2px solid transparent",
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
      {isMarketplace && (
        <Typography variant="b2">{item.price} Coins</Typography>
      )}
      <CardMedia
        component="img"
        image={item.image}
        alt="Furniture Item"
        sx={{
          height: 200,
          width: 200,
          objectFit: "fill",
          borderRadius: 4,
          my: 2,
        }}
      />
    </Card>
  );
}
