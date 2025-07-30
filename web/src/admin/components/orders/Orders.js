import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Calendar, Download } from "lucide-react";
import { fetchOrders } from "../../../redux/orderSlice";
import { fetchVendorProfile } from "../../../redux/vendorSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import OrderDetailsModal from "../../../vendor/components/orders/OrderDetailsModal";
import { FaShoppingCart, FaBox, FaMoneyBillWave, FaChartLine } from 'react-icons/fa'; // Importing React Icons
import { Link } from 'react-router-dom';
const stats = [
  {
    title: "Total Orders",
    value: "1,234",
    change: "+12% from last month",
    changeColor: "text-green-500",
    color: "green",
    textColor: "green",
    icon: FaShoppingCart,  
    text: "View Orders",
    href: "/orders",
    bgView: "bg-green-100",
  },
  {
    title: "Pending Orders",
    value: "56",
    change: "5 need attention",
    changeColor: "text-amber-500",
    color: "amber",
    textColor: "amber",
    icon: FaBox,  
    text: "View Pending",
    href: "/pending",
    bgView: "bg-amber-100", 
  },
  {
    title: "Total Revenue",
    value: "$45,678",
    change: "+8% from last month",
    changeColor: "text-green-500",
    color: "blue",
    textColor: "blue",
    icon: FaMoneyBillWave,  
    text: "View Revenue",
    href: "/revenue",
    bgView: "bg-blue-100",
  },
  {
    title: "Average Order Value",
    value: "$123",
    change: "Based on last 30 days",
    changeColor: "text-gray-500",
    color: "purple",
    textColor: "purple",
    icon: FaChartLine,  
    text: "View AOV",
    href: "/aov",
    bgView: "bg-purple-100", 
  },
];

const Orders = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const { orders, pagination } = useSelector((state) => state.orders);
  const [orderDetails, setOrderDetails] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    search: "",
    sort: "newest",
    category: "",
    payment_status: "",
  });
  const [page, setPage] = useState(1);


  useEffect(() => {
  
      dispatch(
        fetchOrders({  page, filters })
      );
    
  }, [ page, filters]);

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
    <div className="min-h-screen ">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 text-sm">Manage and track your store orders</p>
      </div>
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 mb-8">
      {stats.map((stat, index) => (
      <div
        key={index}
        className="w-full overflow-hidden bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md border border-gray-300 shadow-sm"
      >
        <div className="p-4">
          <div className="flex items-center">
            <div className={`p-3 rounded-full bg-${stat.color}-50`}>
              <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
            </div>
            <div className="ml-4 space-y-1">
              <p className={`text-sm font-medium text-${stat.textColor}-500`}>
                {stat.title}
              </p>
              <h3 className={`text-2xl font-semibold text-${stat.textColor}-500`}>
                {stat.value}
              </h3>
            </div>
          </div>
        </div>
        <div className={`px-6 py-4 ${stat.bgView} border-t`}>
          <div className="flex items-center justify-end">
              <button
                className={`text-sm text-${stat.textColor}-700 transition-colors duration-200`}
              >
                {stat.change}
              </button>
          </div>
        </div>
      </div>
    ))}
  </div>
  


  

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button className="text-blue-600 text-sm">Reset Filters</button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="relative">
            <div className="flex items-center border rounded-lg px-4 py-2">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full outline-none"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between border rounded-lg px-4 py-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  {dateRange === "all" ? "All Time" : dateRange}
                </span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between border rounded-lg px-4 py-2">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className=" text-gray-600 rounded px-4"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="compelte">Complete</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {/* <ChevronDown className="h-5 w-5 text-gray-400" /> */}
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between border rounded-lg px-4 py-2">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  name="payment_status"
                  value={filters.payment_status}
                  onChange={handleFilterChange}
                  className=" text-gray-600 rounded px-4"
                >
                  <option value="">Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="compelte">Complete</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm shadow-sm">
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
            <thead className="bg-black font-normal text-white">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Order NO.</th>
                <th className="text-left px-6 py-3 font-medium">Customer</th>
                <th className="text-left px-6 py-3 font-medium ">Date</th>
                <th className="text-left px-6 py-3 font-medium ">Items</th>
                <th className="text-right px-6 py-3 font-medium ">Total</th>
                <th className="text-left px-6 py-3 font-medium ">Status</th>
                <th className="text-left px-6 py-3 font-medium ">Payment</th>
                <th className="text-left px-6 py-3 font-medium ">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length > 0 ? (
               orders?.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-blue-600 font-medium">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <h2 className="font-medium capitalize">
                      {order.user?.username}
                    </h2>
                    <p className="text-sm text-primary">
                      {order.user?.phone_number}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {format(order.placed_at, "dd MMM yyyy")}
                  </td>
                  <td className="px-6 py-4">{order.items?.length}</td>
                  <td className="px-6 py-4 text-right">
                    ${Number(order.items[0].item_total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        order.order_status === "complete"
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
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment_status}
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
              ))) : (
                <tr className="border  border-gray-300">
                <td colSpan="8" className="p-4 text-center text-sm text-gray-700">
                  No recent orders available
                </td>
              </tr>
              )}
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

export default Orders;
