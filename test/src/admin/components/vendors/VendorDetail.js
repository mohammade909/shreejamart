

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorById } from "../../../redux/vendorSlice"; // Adjust the import path
import { useParams } from "react-router-dom";
import {
  FaStore,
  FaUser,
  FaMoneyBill,
  FaChartBar,
  FaAddressCard,
} from "react-icons/fa";
import {
  MdEmail,
  MdPhone,
  MdCategory,
  MdDescription,
  MdUpdate,
} from "react-icons/md";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import ReactPaginate from "react-paginate";
import { fetchTransactionsByUserId } from "../../../redux/transactionSlice";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccountBalance as BankIcon,
  LocalAtm as MoneyIcon,
  Star as RatingIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";

const VendorDashboard = () => {
  const { vendorId } = useParams();
  const dispatch = useDispatch();
  const { vendor, loading, error } = useSelector((state) => state.vendors);
  const { transactions, pagination, matrix } = useSelector(
    (state) => state.transactions
  );
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    search: "",
    sort: "newest",
    limit: 10,
    payment_status: "",
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (vendor) {
      dispatch(
        fetchTransactionsByUserId({ userId: vendor.user_id, page, filters })
      );
    }
  }, [page, filters, vendor]);

  useEffect(() => {
    dispatch(fetchVendorById(vendorId));
  }, [dispatch, vendorId]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const parsedData =
            typeof vendor.bank_account_details === "string"
              ? JSON.parse(vendor.bank_account_details)
              : vendor.bank_account_details;
  const parsedBrandDetails =
            typeof vendor.brand_details === "string"
              ? JSON.parse(vendor.brand_details)
              : vendor.brand_details;
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Vendor Profile Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={2}
              >
                <Avatar
                  sx={{ width: 100, height: 100, mb: 2 }}
                  src={vendor?.brand_details?.logo_url}
                  alt="Brand Logo"
                  className="object-cover rounded-full border-2 border-gray-300"
                  onError={(e) => {
                    e.target.src = "/defaultlogo.png";
                    e.target.alt = "Default Brand Logo";
                  }}
                />
                <Typography variant="h6">{vendor?.store_name}</Typography>
                <Chip
                  icon={<VerifiedIcon />}
                  label={vendor?.kyc_status}
                  color={
                    vendor?.kyc_status === "approved" ? "success" : "warning"
                  }
                  sx={{ mt: 1 }}
                />
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <BusinessIcon sx={{ mr: 2 }} />
                <Typography>{parsedBrandDetails?.name}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon sx={{ mr: 2 }} />
                <Typography>{vendor?.vendor_email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon sx={{ mr: 2 }} />
                <Typography>{vendor?.vendor_phone}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <RatingIcon sx={{ mr: 2 }} />
                <Typography>Rating: {vendor?.rating} / 5</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Details Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Business Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MoneyIcon sx={{ mr: 2 }} />
                    <Typography>
                      Annual Turnover: ${vendor?.annual_turnover}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MoneyIcon sx={{ mr: 2 }} />
                    <Typography>
                      Monthly Turnover: ${vendor?.monthly_turnover}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <BusinessIcon sx={{ mr: 2 }} />
                    <Typography>
                      Brand Type: {parsedBrandDetails?.brandType}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <BankIcon sx={{ mr: 2 }} />
                    <Typography>
                      Bank: {parsedData?.bank_name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <BankIcon sx={{ mr: 2 }} />
                    <Typography>
                      A/C: {parsedData?.account_number}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <BusinessIcon sx={{ mr: 2 }} />
                    <Typography>
                      Reg. No.: {vendor?.registration_number}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                {parsedBrandDetails?.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Transaction History
              </Typography>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={4}>
                  <Typography>
                    Total Transactions: {matrix?.total_transactions}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>Total Amount: ${matrix?.total_amount}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>
                    Avg Transaction: ${matrix?.average_amount}
                  </Typography>
                </Grid>
              </Grid>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions?.map((txn) => (
                      <TableRow key={txn.transaction_id}>
                        <TableCell>{txn.txn_no}</TableCell>
                        <TableCell>${txn.amount}</TableCell>
                        <TableCell>
                          {new Date(txn.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={txn.status}
                            color={
                              txn.status === "pending" ? "warning" : "success"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{txn.transactionType}</TableCell>
                        <TableCell>{txn.payment_method}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination Component */}
              <Box display="flex" justifyContent="center" mt={2}>
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDashboard;
