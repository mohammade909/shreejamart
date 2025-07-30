import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Calendar, Download } from "lucide-react";
import { fetchOrdersByVendor } from "../../../redux/orderSlice";
import { fetchVendorProfile } from "../../../redux/vendorSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import OrderDetailsModal from "./OrderDetailsModal";

const VendorOrders = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const { orders, pagination } = useSelector((state) => state.orders);
  const { vendor } = useSelector((state) => state.vendors);
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
    dispatch(fetchVendorProfile(auth.user_id));
  }, [auth]);
  useEffect(() => {
    if (vendor) {
      dispatch(
        fetchOrdersByVendor({ vendorId: vendor.vendor_id, page, filters })
      );
    }
  }, [vendor, page, filters]);

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Orders Management</h1>
        <p className="text-gray-600">Manage and track your store order</p>
      </div>

      {/* Stats Overview */}
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300 ">
          <div className="text-gray-600">Total Orders</div>
          <div className="text-2xl font-semibold mt-2">1,234</div>
          <div className="text-sm text-green-500 mt-2">
            +12% from last month
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300 ">
          <div className="text-gray-600">Pending Orders</div>
          <div className="text-2xl font-semibold mt-2">56</div>
          <div className="text-sm text-yellow-500 mt-2">5 need attention</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300 ">
          <div className="text-gray-600">Total Revenue</div>
          <div className="text-2xl font-semibold mt-2">$45,678</div>
          <div className="text-sm text-green-500 mt-2">+8% from last month</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300 ">
          <div className="text-gray-600">Average Order Value</div>
          <div className="text-2xl font-semibold mt-2">$123</div>
          <div className="text-sm text-gray-500 mt-2">
            Based on last 30 days
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-300 ">
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
      <div className="bg-white rounded-lg shadow-sm">
        <div className="py-6 border-b">
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
            <thead className="bg-black">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-200">Order NO.</th>
                <th className="text-left px-6 py-3 font-medium text-gray-200">Customer</th>
                <th className="text-left px-6 py-3 font-medium text-gray-200">Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-200">Items</th>
                <th className="text-right px-6 py-3 font-medium text-gray-200">Total</th>
                <th className="text-left px-6 py-3 font-medium text-gray-200">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-200">Payment</th>
                <th className="text-left px-6 py-3 font-medium text-gray-200">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.length>0?(
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
                  ₹{Number(order.items[0].item_total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
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
              ))):(
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-base text-gray-700  text-center font-semibold border border-gray-300">
                    No orders found
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

export default VendorOrders;
