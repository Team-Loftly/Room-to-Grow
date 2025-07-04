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
        flexDirection: "column",
        bgcolor: "grey.100",
        borderRadius: 10,
        width: "28%",
        height: "80%",
        marginLeft: 14,
        marginRight: 14,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginTop: 1,
          wordBreak: "break-word",
        }}
      >
        {selectedItem.name}
      </Typography>
      <CardMedia
        component="img"
        image={selectedItem.image}
        alt={selectedItem.category}
        sx={{
          maxHeight: 400,
          maxWidth: 400,
          objectFit: "contain",
          borderRadius: 2,
        }}
      />
      <CardContent>
        <Typography
          sx={{
            fontSize: 20,
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
            fontSize: 25,
          }}
        >
          Buy for {selectedItem.price} coins!
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
