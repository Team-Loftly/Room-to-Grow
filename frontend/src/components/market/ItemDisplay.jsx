import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { selectSelectedItem } from "../../features/marketSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInventoryCoins,
  selectInventoryItems,
  spendCoinsAndUpdate,
  addItemAndUpdate,
} from "../../features/roomSlice";
import { useState, useEffect } from "react";
import PaidIcon from "@mui/icons-material/Paid";

export default function ItemDisplay() {
  const selectedItem = useSelector(selectSelectedItem);
  const currentCoins = useSelector(selectInventoryCoins);
  const currentItems = useSelector(selectInventoryItems);
  const dispatch = useDispatch();
  const [purchaseMessage, setPurchaseMessage] = useState("");

  useEffect(() => {
    setPurchaseMessage("");
  }, [selectedItem]);

  const handlePurchase = () => {
    if (currentCoins < selectedItem.price) {
      setPurchaseMessage("You don't have enough coins.");
      return;
    }

    console.log("Current items:", currentItems);
    console.log("Selected item:", selectedItem);
    if (
      currentItems.some(
        (item) =>
          item.decorId === selectedItem._id ||
          item.decorId._id === selectedItem._id
      )
    ) {
      setPurchaseMessage("You already own this item.");
      return;
    }

    dispatch(spendCoinsAndUpdate(selectedItem.price));
    dispatch(addItemAndUpdate(selectedItem._id));
    setPurchaseMessage("Purchase successful!");
  };

  if (!selectedItem) {
    // item is still loading
    return (
      <Stack>
        <Typography
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100vh" }}
        >
          Loading...
        </Typography>
      </Stack>
    );
  }
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        pt: 3,
        borderRadius: 4,
        width: "40%",
        boxSizing: "border-box",
        height: "100%",
        bgcolor: "rgba(245, 245, 245, 0.95)",

        overflowY: "auto",
      }}
    >
      <Typography variant="h4" align="center" sx={{ width: "100%", pb: 3 }}>
        {selectedItem.name}
      </Typography>
      <CardMedia
        component="img"
        image={selectedItem.image}
        alt={selectedItem.category}
        sx={{
          maxHeight: 250,
          maxWidth: 250,
          objectFit: "contain",
          border: "5px solid #0a571f",
          borderRadius: 4,
        }}
      />
      <CardContent>
        <Typography
          align="center"
          sx={{
            fontSize: 20,
            mx: 2,
          }}
        >
          {selectedItem.description}
        </Typography>
      </CardContent>
      {purchaseMessage && (
        <Alert
          severity={
            purchaseMessage === "Purchase successful!" ? "success" : "error"
          }
          onClose={() => setPurchaseMessage("")}
        >
          {purchaseMessage}
        </Alert>
      )}
      <CardActions
        sx={{
          mb: 3,
        }}
      >
        <Button
          onClick={handlePurchase}
          variant="contained"
          size="large"
          sx={{
            fontSize: 20,
            bgcolor: "#0a571f",
          }}
        >
          Buy for {selectedItem.price}{" "}
          <PaidIcon fontSize="medium" className="text-yellow-500" />
        </Button>
      </CardActions>
    </Card>
  );
}
