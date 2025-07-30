import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  LinearProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import {
  AccountBalanceWallet as WalletIcon,
  DirectionsBike as BikeIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  TimelineOutlined as TimelineIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  NavigateNext as NextIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchPartnerProfile, updatePartner } from "../../redux/partnersSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import DeliveryOrdersPage from "../components/orders/PendingOrders";
import WithdrawModal from "../../components/WithdrawModal";
import { BASEURL } from "../../baseurl";
const DeliveryPartnerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const { partner, loading } = useSelector((state) => state.partners);
  const [earnings, setEarnings] = useState({});
  const [orders, setOrders] = useState({});

  useEffect(() => {
    if (auth) {
      dispatch(fetchPartnerProfile(auth.user_id));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        if (partner) {
          const partnerId = partner.partner_id;

          // Make both API calls concurrently
          const [ordersResponse, earningsResponse] = await Promise.all([
            axios.get(
              `${BASEURL}/api/v1/partners/orders/${partnerId}`
            ),
            axios.get(
              `${BASEURL}/api/v1/partners/earnings/${partnerId}`
            ),
          ]);

          // Handle the responses
          setOrders(ordersResponse.data);
          setEarnings(earningsResponse.data);
        
        }
      } catch (error) {
        console.error("Error fetching partner data:", error);
      }
    };

    fetchPartnerData();
  }, [partner]);

  // Mock data - replace with real data from your API
  const partnerData = {
    name: "Mohammad Aasif",
    rating: 4.8,
    status: "Online",
    earnings: {
      today: 850,
      weekly: 5600,
      monthly: 22400,
    },
    deliveries: {
      completed: 1245,
      cancelled: 23,
      ongoing: 2,
    },
    wallet: {
      balance: 2840.5,
      pending: 450.0,
    },
    stats: {
      acceptanceRate: 95,
      completionRate: 98,
      averageSpeed: 22,
    },
  };

  const earningsData = [
    { day: "Mon", amount: 820 },
    { day: "Tue", amount: 920 },
    { day: "Wed", amount: 880 },
    { day: "Thu", amount: 1100 },
    { day: "Fri", amount: 950 },
    { day: "Sat", amount: 1200 },
    { day: "Sun", amount: 850 },
  ];


  const handleStatus = async () => {
    // Set loading state to true
    try {
      // Dispatch action to update the partner's status
      dispatch(
        updatePartner({
          partnerId: partner.partner_id,
          updatedData: {
            partner_status:
              partner.partner_status === "active" ? "inactive" : "active",
          },
        })
      );

      // Fetch the updated partner profile after the update
      dispatch(fetchPartnerProfile(auth.user_id));

      // Show success toast after updating the status
      toast.success(`You are now ${partner?.partner_status}`);
    } catch (error) {
      toast.error("Failed to update partner status!");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }} className="shadow-lg">
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                fontSize: "2rem",
              }}
            >
              {partnerData.name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" className="capitalize" gutterBottom>
              Welcome back, {auth?.firstname} {auth?.lastname}!
            </Typography>
            <Box display="flex" gap={1}>
              <Chip
                icon={<BikeIcon />}
                label={partner?.partner_status}
                color={
                  partner?.partner_status == "active" ? "success" : "error"
                }
                variant="outlined"
              />
              <Chip
                icon={<StarIcon />}
                label={`${partnerData.rating} Rating`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item>
            <Button
              onClick={handleStatus}
              variant="contained"
              color={partner.partner_status === "active" ? "error" : "success"}
              startIcon={
                partner.partner_status === "active" ? (
                  <BikeIcon />
                ) : (
                  <BikeIcon />
                )
              }
            >
              {loading
                ? "Loading..."
                : partner.partner_status === "active"
                ? "Go Offline"
                : "Go Online"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DeliveryOrdersPage/>
      <Grid container spacing={3}>
        {/* Earnings Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <TrendingUpIcon color="primary" /> Earnings Overview
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Card sx={{ bgcolor: "primary.light" }}>
                  <CardContent>
                    <Typography color="white" variant="subtitle2">
                      Today's Earnings
                    </Typography>
                    <Typography color="white" variant="h4">
                      ₹{earnings?.todayEarnings}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ bgcolor: "success.light" }}>
                  <CardContent>
                    <Typography color="white" variant="subtitle2">
                      Weekly Earnings
                    </Typography>
                    <Typography color="white" variant="h4">
                      ₹{earnings?.currentWeekEarnings}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ bgcolor: "info.light" }}>
                  <CardContent>
                    <Typography color="white" variant="subtitle2">
                      Total Earnings
                    </Typography>
                    <Typography color="white" variant="h4">
                      ₹{earnings?.totalEarnings}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Wallet Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <WalletIcon color="primary" /> Wallet
            </Typography>
            <Card sx={{ bgcolor: "grey.100", mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Available Balance
                </Typography>
                <Typography variant="h3" color="primary.main" gutterBottom>
                  ₹{partner?.wallet_balance}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending: ₹{partnerData.wallet.pending}
                </Typography>
              </CardContent>
            </Card>
           <WithdrawModal walletBalance={partner?.wallet_balance} userId={auth?.user_id}/>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <SpeedIcon color="primary" /> Performance Metrics
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Acceptance Rate"
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LinearProgress
                        variant="determinate"
                        value={partnerData.stats.acceptanceRate}
                        sx={{ flex: 1, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {partnerData.stats.acceptanceRate}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Completion Rate"
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LinearProgress
                        variant="determinate"
                        value={partnerData.stats.completionRate}
                        sx={{ flex: 1, mr: 1 }}
                        color="success"
                      />
                      <Typography variant="body2">
                        {partnerData.stats.completionRate}%
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Average Speed"
                  secondary={`${partnerData.stats.averageSpeed} km/h`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Delivery Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ShippingIcon color="primary" /> Delivery Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">
                    {orders?.completedOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <TimeIcon color="warning" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">{orders?.pendingOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ongoing
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <CancelIcon color="error" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">
                    {orders?.cancelledOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Deliveries */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <TimelineIcon color="primary" /> Recent Deliveries
            </Typography>
            <List>
              {orders?.todaysOrders && orders.todaysOrders.length > 0 ? (
                orders.todaysOrders.map((delivery) => (
                  <React.Fragment key={delivery.order_id}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end">
                          <NextIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={delivery.order_number}
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" color="text.secondary">
                              ₹{delivery.delivery_charge} • {delivery.time}
                            </Typography>
                            <Chip
                              size="small"
                              label={delivery.order_status}
                              color="success"
                              sx={{ mt: 1 }}
                            />
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  No orders for today.
                </Typography>
              )}
            </List>
            <Button onClick={()=>navigate('/partner/orders')} fullWidth variant="text" endIcon={<NextIcon />}>
              View All Deliveries
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryPartnerDashboard;
