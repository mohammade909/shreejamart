  // ... (previous state and data remain the same)

  // New sample transaction data
  const recentTransactions = [
    {
      id: "TRX001",
      type: "credit",
      amount: 1250.0,
      description: "Order payment #12345",
      timestamp: "2024-01-29 14:30",
    },
    {
      id: "TRX002",
      type: "debit",
      amount: 500.0,
      description: "Withdrawal to bank",
      timestamp: "2024-01-29 12:15",
    },
    {
      id: "TRX003",
      type: "credit",
      amount: 890.5,
      description: "Order payment #12346",
      timestamp: "2024-01-29 10:45",
    },
    {
      id: "TRX004",
      type: "credit",
      amount: 445.25,
      description: "Order payment #12347",
      timestamp: "2024-01-29 09:20",
    },
  ];

  // Transaction component
  const Transaction = ({ transaction }) => (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor:
              transaction.type === "credit"
                ? "success.lighter"
                : "error.lighter",
            color:
              transaction.type === "credit" ? "success.main" : "error.main",
          }}
        >
          {transaction.type === "credit" ? (
            <ArrowUp size={20} />
          ) : (
            <ArrowDown size={20} />
          )}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" fontWeight="medium">
              {transaction.description}
            </Typography>
            <Typography
              variant="body2"
              color={
                transaction.type === "credit" ? "success.main" : "error.main"
              }
              fontWeight="bold"
            >
              {transaction.type === "credit" ? "+" : "-"}₹
              {transaction.amount.toFixed(2)}
            </Typography>
          </Box>
        }
        secondary={transaction.timestamp}
      />
    </ListItem>
  );
