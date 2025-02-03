import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Calendar, Download } from "lucide-react";
import {
  Button,
  CardHeader,
  Input,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { fetchOrders } from "../../../redux/orderSlice";
import { fetchPartnerProfile } from "../../../redux/partnersSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import OrderDetailsModal from "../../../vendor/components/orders/OrderDetailsModal";

const OrderList = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const { orders, pagination } = useSelector((state) => state.orders);
  const { partner } = useSelector((state) => state.partners);
  const [orderDetails, setOrderDetails] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    search: "",
    sort: "newest",

  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPartnerProfile(auth.user_id));
  }, [dispatch]);

  useEffect(() => {
    if (partner) {
      dispatch(fetchOrders({ page, filters, partnerId: partner.partner_id }));
    }
  }, [page, filters, partner]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  // Filter states
  const [dateRange, setDateRange] = useState("all");

  const hadleView = (order) => {
    setOpen(true);
    setOrderDetails(order);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-600">Manage and track your store orders</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold mt-2">1,234</div>
          <div className="text-sm text-green-500 mt-2">
            +12% from last month
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-gray-600">Pending Orders</div>
          <div className="text-2xl font-bold mt-2">56</div>
          <div className="text-sm text-yellow-500 mt-2">5 need attention</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-gray-600">Total Revenue</div>
          <div className="text-2xl font-bold mt-2">$45,678</div>
          <div className="text-sm text-green-500 mt-2">+8% from last month</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-gray-600">Average Order Value</div>
          <div className="text-2xl font-bold mt-2">$123</div>
          <div className="text-sm text-gray-500 mt-2">
            Based on last 30 days
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Date From"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Date To"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Limit"
                name="limit"
                value={filters.limit}
                onChange={handleFilterChange}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Orders</h2>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm ">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600">Order NO.</th>
                <th className="text-left px-6 py-3 text-gray-600">Customer</th>
                <th className="text-left px-6 py-3 text-gray-600">Date</th>
                <th className="text-right px-6 py-3 text-gray-600">Charges</th>
                <th className="text-left px-6 py-3 text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders?.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-blue-600 font-medium">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <h2 className="font-medium capitalize">
                      {order.user?.firstname}
                      {order.user?.lastname}
                    </h2>
                    <p className="text-sm text-primary">
                      {order.user?.phone_number}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {format(order.placed_at, "dd MMM yyyy")}
                  </td>
                  <td className={`px-2 text-center  ${
                        order.order_status === "completed"
                          ? " text-green-800"
                          : order.order_status === "pending"
                          ? " text-yellow-800"
                          : "text-red-800"
                      }`}>
                    ₹{Number(order.delivery_charge).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full capitalize text-sm ${
                        order.order_status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.order_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => hadleView(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <OrderDetailsModal
          order={orderDetails}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
        {pagination?.totalPages > 1 && (
          <div className="mt-4">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pagination.totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"flex justify-center gap-2"}
              activeClassName={"text-blue-500 font-bold"}
              pageClassName={
                "px-3 py-1 border rounded hover:bg-gray-200 cursor-pointer"
              }
            />
          </div>
        )}
        {/* Pagination */}
      </div>
    </div>
  );
};

export default OrderList;
