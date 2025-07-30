import React, { useState, useEffect } from "react";

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
import ReactPaginate from "react-paginate";
import { Calendar, DollarSign, CreditCard, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchAllTransactions,
  updateTransaction,
} from "../../../redux/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, pagination } = useSelector(
    (state) => state.transactions
  );
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    search: "",
    sort: "newest",
    limit: 10,
  });
  const [page, setPage] = useState(1);
  useEffect(() => {
    dispatch(fetchAllTransactions({ page, filters }));
  }, [page, filters]);

  // Calculate statistics
  const stats = {
    totalAmount: transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
    completed: transactions.filter((t) => t.status === "completed").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    failed: transactions.filter((t) => t.status === "failed").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const handleAction = async (action, id) => {
    try {
      const resultAction = await dispatch(
        updateTransaction({
          transactionId: id,
          updateData: { status: action },
        })
      ).unwrap();

      // Show success toast
      toast.success("Transaction updated successfully!");
      dispatch(fetchAllTransactions({ page, filters }));
      // Optional: Log response or perform additional actions
      console.log(resultAction);
    } catch (error) {
      // Show error toast
      toast.error("Failed to update the transaction. Please try again.");
      console.error(error);
    }
  };
  return (
    <div className="p-2 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Amount
                </p>
                <p className="text-2xl font-bold">
                  ₹{stats.totalAmount.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
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
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Approved</MenuItem>
                <MenuItem value="cancelled">Rejected</MenuItem>
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

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <h2>Transactions</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-black text-white">
                  <th className="px-4 py-3 text-left font-medium">TXN</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Payment Method</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions?.map((transaction) => (
                    <tr key={transaction.transaction_id} className="border-b">
                      <td className="px-4 py-2">{transaction.txn_no}</td>
                      <td className="px-4 py-2">
                        {new Date(
                          transaction.transaction_date
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {transaction.firstname} {transaction.lastname}
                        <br />
                        {transaction.email}
                      </td>
                      <td className="px-4 py-2">₹{transaction.amount}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {transaction.payment_method}
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        {transaction.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleAction(
                                  "completed",
                                  transaction?.transaction_id
                                )
                              }
                              className="text-xs p-2 border hover:text-blue-300 border-blue-300 hover:scale-105"
                            >
                              Settle
                            </button>
                            <button
                              onClick={() =>
                                handleAction(
                                  "cancelled",
                                  transaction?.transaction_id
                                )
                              }
                              className="text-xs p-2 border hover:text-red-300 border-red-300 hover:scale-105"
                            >
                              Cancelled
                            </button>
                            <Link
                              to={`/dashboard/transactions/${transaction?.user_id}`}
                              className="text-blue-500 p-2 border border-blue-300 underline hover:text-blue-700"
                            >
                              View
                            </Link>
                          </>
                        ) : (
                          <Link
                            to={`/dashboard/transactions/${transaction?.user_id}`}
                            className="text-blue-500 p-2 border border-blue-300 underline hover:text-blue-700"
                          >
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <p className=" m-auto py-3 text-red-500 text-sm tracking-wider font-sans">
                    404! No transaction found!
                  </p>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
