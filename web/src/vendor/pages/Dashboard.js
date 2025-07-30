import React, { useState, useEffect, version } from "react";
import axios from "axios";
import { BASEURL } from "../../baseurl";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorProfile } from "../../redux/vendorSlice";
import WithdrawModal from "../../components/WithdrawModal";
import StatCard from "../components/StatCard";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Button,
  LinearProgress,
  Chip,
  Stack,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronRight,
  Wallet,
  ArrowUp,
  ArrowDown,
  CreditCard,
  RefreshCcw,
} from "lucide-react";

// ... (previous imports and helper components remain the same)

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { vendor } = useSelector((state) => state.vendors);
  const [data, setData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data from API when the component mounts
    if (auth?.user_id) dispatch(fetchVendorProfile(auth?.user_id));
  }, [auth]);

  useEffect(() => {
    // Fetch metrics data when vendor_id is available
    const fetchData = async (vendorId) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASEURL}/api/v1/vendors/matrics/${vendorId}`
        );
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendor?.vendor_id) {
      fetchData(vendor?.vendor_id);
    }
  }, [vendor, BASEURL]);

  const salesData = [
    { name: "Mon", sales: 4000 },
    { name: "Tue", sales: 3000 },
    { name: "Wed", sales: 5000 },
    { name: "Thu", sales: 2780 },
    { name: "Fri", sales: 1890 },
    { name: "Sat", sales: 6390 },
    { name: "Sun", sales: 3490 },
  ];

  const categoryData = [
    { name: "Electronics", value: 400 },
    { name: "Fashion", value: 300 },
    { name: "Food", value: 300 },
    { name: "Home", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      completed: "success",
      processing: "info",
    };
    return colors[status] || "default";
  };

  return (
    <Box >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Vendor Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={data?.metrics?.total_sales ?? "N/A"}
            icon={DollarSign}
            trend={12}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={data?.metrics?.total_orders ?? "N/A"}
            icon={ShoppingBag}
            trend={-4}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Products"
            value={data?.metrics?.total_products ?? "N/A"}
            icon={Package}
            trend={8}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Customers"
            value="2,420"
            icon={Users}
            trend={16}
            color="info"
          />
        </Grid>
      </Grid>

      <Box sx={{ width: "100%", mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StatCard
                  title="Total Stock Val"
                  value={data?.metrics?.total_stock_value ?? "N/A"}
                  icon={DollarSign}
                  trend={12}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard
                  title="Total Sock Quantity"
                  value={data?.metrics?.total_stock_quantity ?? "N/A"}
                  icon={ShoppingBag}
                  trend={-4}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard
                  title="In Stock"
                  value={data?.metrics?.active_products ?? "N/A"}
                  icon={Package}
                  trend={8}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard
                  title="Out Of Stock"
                  value={data?.metrics?.out_of_stock_products ?? "N/A"}
                  icon={Users}
                  trend={16}
                  color="info"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid  item xs={12} md={6}>
            <Paper
            className="border border-gray-300"
              sx={{
                p: 3,
                height: "100%",
                bgcolor: "#f8f8fb",
                color: "#4b5966",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box className="">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Wallet Balance</Typography>
                  <Wallet size={24} />
                </Box>
                <Typography variant="h4" sx={{ mb: 4, color: "#2f3642" }}>
                  ₹{vendor?.wallet_balance}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <WithdrawModal
                    walletBalance={vendor?.wallet_balance}
                    userId={auth?.user_id}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<RefreshCcw size={18} />}
                    sx={{
                      bgcolor: "#5caf90",
                      "&:hover": { bgcolor: "#4e9b7d" },
                      py: 1.5,
                    }}
                  >
                    History
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h6">Sales Overview</Typography>
              <IconButton size="small">
                <MoreVertical size={20} />
              </IconButton>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {categoryData.map((item, index) => (
                <Box
                  key={item.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: COLORS[index],
                    }}
                  />
                  <Typography variant="body2">{item.name}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6">Recent Orders</Typography>
          <Button
            endIcon={<ChevronRight size={20} />}
            sx={{ textTransform: "none" }}
          >
            View All
          </Button>
        </Box>
        <List>
          {data?.recentOrders?.map((order, index) => (
            <React.Fragment key={order.id}>
              <ListItem
                secondaryAction={
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <ShoppingBag size={20} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Typography
                        variant="body2"
                        component="span"
                        fontWeight="bold"
                      >
                        {order.id}
                      </Typography>
                      <Typography variant="body2" component="span">
                        from {order.customer}
                      </Typography>
                    </Box>
                  }
                  secondary={`₹${order.amount}`}
                />
              </ListItem>
              {index < recentOrders.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default VendorDashboard;
