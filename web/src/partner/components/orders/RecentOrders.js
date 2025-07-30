import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { updateOrder } from "../../../redux/orderSlice";
import { fetchPartnerProfile } from "../../../redux/partnersSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
const DeliveryOrdersModal = ({ orders, open, onClose, userId }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.orders);
  const { partner } = useSelector((state) => state.partners);

  useEffect(() => {
    dispatch(fetchPartnerProfile(userId));
  }, [userId]);
  
  const handleAccept = async (orderId) => {
    dispatch(updateOrder({ orderId, updatedData: { partner_id: partner?.partner_id } }))
      .then(() => {
        toast.success("Order Accepted successfully!");
        onClose(false);
      })
      .catch((error) => {
        toast.error("Failed to update the order. Please try again.");
      });
  };

  const handleReject = async (orderId) => {
    // setOrders(orders.filter((order) => order.order_id !== orderId));
    // Add API call logic here
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { maxHeight: "90vh", width: "100%", maxWidth: 600 },
      }}
    >
      <DialogTitle>Available Delivery Orders</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : orders.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No orders available
            </Typography>
          ) : (
            orders.map((order) => (
              <Paper
                key={order.order_id}
                elevation={0}
                variant="outlined"
                sx={{ p: 2, bgcolor: "grey.50" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Box>
                    <Typography fontWeight="medium">
                      {order.order_number}
                    </Typography>
                    <Typography variant="body2">
                      {order.user.firstname} {order.user.lastname}
                    </Typography>
                    <Typography variant="body2">
                      {order.user.phone_number}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="600">
                    ₹{order.delivery_charge}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Delivery Location:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {order.location}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleAccept(order.order_id)}
                    sx={{
                      bgcolor: "success.main",
                      "&:hover": { bgcolor: "success.dark" },
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(order.order_id)}
                  >
                    Reject
                  </Button>
                </Box>
              </Paper>
            ))
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryOrdersModal;
