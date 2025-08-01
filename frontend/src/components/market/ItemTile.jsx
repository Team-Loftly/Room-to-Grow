import { Card, CardMedia, Fade, Typography } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";

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
        bgcolor: "white",
        borderRadius: 4,
        m: 2,
        px: 5,
        pt: 1,
        cursor: "pointer",
        border: selected ? "5px solid #0a571f" : "5px solid transparent",
        width: 250,
        opacity: 0.95,
      }}
    >
      {" "}
      <Typography
        variant="h6"
        sx={{
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
        <Typography variant="b2">
          {item.price}{" "}
          <PaidIcon fontSize="medium" className="text-yellow-500" />
        </Typography>
      )}
      <CardMedia
        component="img"
        image={item.image}
        alt="Furniture Item"
        sx={{
          height: 200,
          width: 200,
          objectFit: "contain",
          borderRadius: 4,
        }}
      />
    </Card>
  );
}
