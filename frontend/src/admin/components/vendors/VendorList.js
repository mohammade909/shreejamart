import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendors, updateVendor } from "../../../redux/vendorSlice"; // Adjust this import based on your project structure
import {
  LuBuilding,
  LuMail,
  LuPhone,
  LuMap,
  LuDollarSign,
  LuCalendar,
  LuCreditCard,
  LuStar,
} from "react-icons/lu";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

const VendorList = () => {
  const dispatch = useDispatch();
  const { vendors, pagination, loading, error } = useSelector(
    (state) => state.vendors
  ); 

  const [filters, setFilters] = useState({
    search: "",
    sort: "newest",
    limit: 10,
    kycStatus: "",
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    
    dispatch(fetchVendors({ page, ...filters }));
  }, [dispatch, page, filters]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
    } catch (error) {
      return "N/A";
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const getStatusStyles = (currentStatus) => {
    switch (currentStatus) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleChange = (e, id) => {
    const newStatus = e.target.value;
    dispatch(
      updateVendor({ vendorId: id, updatedData: { kyc_status: newStatus } })
    ); 
  
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
        <div className="text-lg font-medium text-gray-600">
          Total Vendors: {pagination.total}
        </div>
      </div>

      {/* Pagination */}

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
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Date To"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Kyc "
                name="kycStatus"
                value={filters.kycStatus}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => {
          const parsedData =
            typeof vendor.bank_account_details === "string"
              ? JSON.parse(vendor.bank_account_details)
              : vendor.bank_account_details;

              const parsedBrandDetails =
              typeof vendor.brand_details === "string"
                ? JSON.parse(vendor.brand_details)
                : vendor.brand_details;
          return (
            <div
              key={vendor.vendor_id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <Link to={`/dashboard/vendors/${vendor.vendor_id}`}>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {vendor.store_name || "Unnamed Store"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {parsedBrandDetails?.category || "Uncategorized"}
                  </p>
                </Link>
                <select
                  value={vendor.kyc_status}
                  onChange={(e) => handleChange(e, vendor.vendor_id)}
                  // disabled={isLoading}
                  className={`text-sm font-medium px-3 py-1 rounded-full cursor-pointer outline-none border-none 
        ${getStatusStyles(vendor.kyc_status)}
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200`}
                >
                  <option value="pending" className="bg-white text-gray-800">
                    PENDING
                  </option>
                  <option value="approved" className="bg-white text-gray-800">
                    APPROVED
                  </option>
                  <option value="rejected" className="bg-white text-gray-800">
                    REJECTED
                  </option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center">
                    <LuBuilding className="w-5 h-5 mr-2 text-gray-500" />
                    {vendor.vendor_name || "N/A"}
                  </div>
                  <div className="flex items-center">
                    <LuMail className="w-5 h-5 mr-2 text-gray-500" />
                    {vendor.vendor_email || "N/A"}
                  </div>
                  {vendor.vendor_phone && (
                    <div className="flex items-center">
                      <LuPhone className="w-5 h-5 mr-2 text-gray-500" />
                      {vendor.vendor_phone}
                    </div>
                  )}
                  {vendor.address && (
                    <div className="flex items-center">
                      <LuMap className="w-5 h-5 mr-2 text-gray-500" />
                      {vendor.address}
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center">
                    <LuCreditCard className="w-5 h-5 mr-2 text-gray-500" />
                    Bank: {parsedData?.bank_name}
                  </div>
                  <div className="flex items-center">
                    <LuStar className="w-5 h-5 mr-2 text-yellow-500" />
                    Rating:{" "}
                    {vendor.rating
                      ? parseFloat(vendor.rating).toFixed(1)
                      : "0.0"}
                  </div>
                  <div className="flex items-center">
                    <LuDollarSign className="w-5 h-5 mr-2 text-gray-500" />
                    Monthly: {formatCurrency(vendor.monthly_turnover)}
                  </div>
                  <div className="flex items-center">
                    <LuCalendar className="w-5 h-5 mr-2 text-gray-500" />
                    Joined: {formatDate(vendor.vendor_created_at)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm mt-4">
                    {vendor.brand_details?.description ||
                      "No description available"}
                  </p>
                  <p className="text-gray-500 text-sm mt-4">
                    <img
                      src={parsedBrandDetails?.logo_url}
                      alt="Brand Logo"
                      className="w-10 h-10 object-cover rounded-full mt-2"
                      onError={(e) => {
                        e.target.src = "/defaultlogo.png";
                        e.target.alt = "Default blog Image"; // Update the alt text for accessibility
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
};

export default VendorList;
