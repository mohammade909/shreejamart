import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
} from "@mui/material";
import {CreditCard} from 'lucide-react'
import { createTransaction } from "../redux/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const WithdrawModal = ({ userId, walletBalance }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleWithdraw = async () => {
    setError("");

    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }

    if (withdrawAmount > walletBalance) {
      toast.error("Withdrawal amount exceeds wallet balance.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    try {
      const result = await dispatch(
        createTransaction({
          user_id: userId,
          amount,
          password,
          transactionType: "withdraw",
          payment_method: "Bank transfer",
          reference_id: "BANK$$3",
          description: "Bank transfer",
        })
      ).unwrap();

      if (result.success) {
        toast.success(`Successfully withdrew $${withdrawAmount}`);
        handleClose();
      } else {
        toast.error(result.message || "Transaction failed. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while processing the transaction."
      );
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        fullWidth
        startIcon={<CreditCard size={18} />}
        sx={{
          bgcolor: "#5caf90",
          "&:hover": { bgcolor: "#4e9b7d" },
          py: 1.5,
        }}
      >
        Withdraw
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Withdraw Funds</DialogTitle>

        <DialogContent className="no-scrollbar">
          <DialogContentText>
            Current Balance: ₹{walletBalance}
          </DialogContentText>

          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Withdrawal Amount"
              type="number"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ max: walletBalance }}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Box
              sx={{
                border: "1px solid rgba(0,0,0,0.23)",
                borderRadius: 1,
                p: 2,
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Terms and Conditions
              </Typography>

              <Typography variant="body2" color="textSecondary">
                <strong>1. Withdrawal Limits:</strong>
                <ul>
                  <li>Minimum withdrawal: ₹500</li>
                  <li>Maximum daily withdrawal: ₹5,000</li>
                </ul>

                <strong>2. Processing:</strong>
                <ul>
                  <li>Withdrawals processed within 1-3 business days</li>
                  <li>Fees may apply depending on withdrawal method</li>
                </ul>

                <strong>3. Security:</strong>
                <ul>
                  <li>Password required for all withdrawals</li>
                  <li>Two-factor authentication may be required</li>
                </ul>
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
              }
              label="I agree to the Terms and Conditions"
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleWithdraw} color="primary" variant="contained">
            Confirm Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WithdrawModal;
