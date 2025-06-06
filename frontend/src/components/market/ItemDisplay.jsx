import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
} from "@mui/material";

export default function ItemDisplay() {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        bgcolor: "grey.100",
        borderRadius: 10,
        width: "28%",
        marginLeft: 14,
        marginRight: 14,
      }}
    >
      <Typography
        sx={{
          fontSize: 50,
          marginTop: 1,
        }}
      >
        Furniture 0
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
      <CardContent>
        <Typography
          sx={{
            fontSize: 25,
          }}
        >
          A cozy queen sized bed.
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          size="large"
          sx={{
            fontSize: 25,
          }}
        >
          Buy for 15 points!
        </Button>
      </CardActions>
    </Card>
  );
}
