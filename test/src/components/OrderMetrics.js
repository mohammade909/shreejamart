import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Container,
  Box,
} from "@mui/material";
import { DollarSign, Package, Truck, PieChart } from "lucide-react";
import {BASEURL} from '../baseurl'
const cardStyles = {
  orders: {
    iconBg: "#e8f5e9",
    iconColor: "#2e7d32",
    textColor: "#1b5e20",
  },
  amount: {
    iconBg: "#e3f2fd",
    iconColor: "#1565c0",
    textColor: "#0d47a1",
  },
  delivery: {
    iconBg: "#fff3e0",
    iconColor: "#ef6c00",
    textColor: "#e65100",
  },
  commission: {
    iconBg: "#f3e5f5",
    iconColor: "#7b1fa2",
    textColor: "#4a148c",
  },
};

const MetricCard = ({ title, value, percentage, icon: Icon, variant }) => {
  const style = cardStyles[variant];

  return (
    <Card elevation={2}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: "bold",
                my: 1,
                color: style.textColor,
              }}
            >
              {value}
            </Typography>
            {percentage !== undefined && (
              <Typography
                variant="body2"
                sx={{
                  color: style.textColor,
                  fontWeight: "medium",
                }}
              >
                {percentage}% of total
              </Typography>
            )}
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              bgcolor: style.iconBg,
              borderRadius: "50%",
            }}
          >
            <Icon style={{ width: 24, height: 24, color: style.iconColor }} />
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};

const calculatePercentages = (metrics, overallMetrics) => {
  return {
    total_orders: (
      (metrics?.total_orders / overallMetrics?.total_orders) *
      100
    ).toFixed(1),
    total_amount: (
      (parseFloat(metrics?.total_amount) /
        parseFloat(overallMetrics?.total_amount)) *
      100
    ).toFixed(1),
    total_delivery_charges: (
      (parseFloat(metrics?.total_delivery_charges) /
        parseFloat(overallMetrics?.total_delivery_charges)) *
      100
    ).toFixed(1),
    total_commission: (
      (parseFloat(metrics?.total_commission) /
        parseFloat(overallMetrics?.total_commission)) *
      100
    ).toFixed(1),
  };
};

const StatusSection = ({ title, metrics, overallMetrics }) => {
  const percentages = overallMetrics
    ? calculatePercentages(metrics, overallMetrics)
    : null;

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          {title}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Total Orders"
              value={metrics?.total_orders || 0}
              percentage={
                percentages?.total_orders ? percentages.total_orders : 0.0
              }
              icon={Package}
              variant="orders"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Total Amount"
              value={
                metrics?.total_amount
                  ? `₹${parseFloat(metrics?.total_amount).toFixed(2)}`
                  : 0.0
              }
              percentage={
                percentages?.total_amount ? percentages.total_amount : "0.00"
              }
              icon={DollarSign}
              variant="amount"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Delivery Charges"
              value={
                metrics?.total_delivery_charges
                  ? `₹${parseFloat(metrics?.total_delivery_charges).toFixed(2)}`
                  : 0.0
              }
              percentage={
                percentages?.total_delivery_charges
                  ? percentages.total_delivery_charges
                  : 0.0
              }
              icon={Truck}
              variant="delivery"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricCard
              title="Commission"
              value={
                metrics?.total_commission
                  ? `₹${parseFloat(metrics?.total_commission).toFixed(2)}`
                  : 0.0
              }
              percentage={
                percentages?.total_commission
                  ? percentages?.total_commission
                  : 0.0
              }
              icon={PieChart}
              variant="commission"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
const OrderMetrics = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASEURL}/api/v1/auth/orders/matrix`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Box sx={{ mb: 4 }}>
        <StatusSection
          title="Overall Metrics"
          metrics={data?.metrics?.overall}
        />
      </Box>

      <Grid container spacing={4} className="mb-5">
        <Grid item xs={12} md={6}>
          <StatusSection
            title="Completed Orders"
            metrics={data?.metrics?.status_metrics?.completed}
            overallMetrics={data?.metrics?.overall}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatusSection
            title="Cancelled Orders"
            metrics={data?.metrics?.status_metrics?.cancelled}
            overallMetrics={data?.metrics?.overall}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderMetrics;
