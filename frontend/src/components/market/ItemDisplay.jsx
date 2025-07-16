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
} from "../../features/inventorySlice";
import { useState, useEffect } from "react";

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
        justifyContent: "center",
        flexDirection: "column",
        m: 4,
        p: 2,
        borderRadius: 4,
        width: "40%",
        height: "90%",
        bgcolor: "rgba(255,255,255,0.8)",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ width: "100%" }}
      >
        {selectedItem.name}
      </Typography>
      <CardMedia
        component="img"
        image={selectedItem.image}
        alt={selectedItem.category}
        sx={{
          maxHeight: 300,
          maxWidth: 300,
          objectFit: "contain",
          borderRadius: 4,
        }}
      />
      <CardContent>
        <Typography
          sx={{
            fontSize: 15,
          }}
        >
          {selectedItem.description}
        </Typography>
      </CardContent>
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
          Buy for {selectedItem.price} coins
        </Button>
      </CardActions>
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
    </Card>
  );
}
