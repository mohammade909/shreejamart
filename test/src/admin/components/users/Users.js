import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, resetState, deleteUser } from "../../../redux/usersSlice";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import SuccessModal from "../../../components/SuccessModal";
import ConfirmPopup from "../../../components/ConfirmPopup";
import UserDetailsModal from "./UserDetailsModal";
import ReactPaginate from "react-paginate";
export default function Users() {
  const dispatch = useDispatch();
  const { users, message, pagination } = useSelector((state) => state.users);
  // Replace with your actual token
  const [info, setInfo] = useState(false);
  const [open, setOpen] = useState(false);
  const [updatedStatuses, setUpdatedStatuses] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    user_type: "",
    search: "",
    sort: "newest",
    limit: 10,
    payment_status: "",
  });
  const [page, setPage] = useState(1);
  useEffect(() => {
    dispatch(getUsers({ page, filters }));
  }, [page, filters]);

  // const handleStatusChange = (userId, key, value) => {
  //   setUpdatedStatuses((prevStatuses) => ({
  //     ...prevStatuses,
  //     [userId]: {
  //       ...prevStatuses[userId],
  //       [key]: value,
  //     },
  //   }));
  //   setStatusChanged((prev) => ({ ...prev, [userId]: true }));
  // };

  const handleDelete = (userId) => {
    setOpenDelete(true);
    setDeleteUserId(userId);
  };

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);
  // const handleSave = (userId) => {
  //   const updatedUser = updatedStatuses[userId];
  //   if (updatedUser) {
  //     dispatch(updateUser({ userId, updatedData: updatedUser }));
  //     setStatusChanged((prev) => ({ ...prev, [userId]: false }));
  //   }
  // };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-300 text-white";
      case "approved":
        return "bg-green-300 text-white";
      case "rejected":
        return "bg-red-300 text-white";
      default:
        return "";
    }
  };

  const getUserStatus = (user, updatedStatuses, statusKey) =>
    updatedStatuses[user.user_id]?.[statusKey] || user[statusKey];

  const handleView = (user) => {
    setInfo(true);
    setUserDetails(user);
  };


  return (
    <>
      <div className="">
        <SuccessModal
          open={open}
          setOpen={setOpen}
          reset={resetState}
          message={message}
        />
        <UserDetailsModal
          userDetails={userDetails}
          setOpen={setInfo}
          open={info}
        />
        <ConfirmPopup
          isOpen={openDelete}
          onClose={() => setOpenDelete(false)}
          id={deleteUserId}
          actionFunction={deleteUser}
          message={"Are want to delete user?"}
        />
      </div>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Accounts
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          View accounts of registered users
        </Typography>

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
                  label="User Type"
                  name="user_type"
                  value={filters.user_type}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Users</MenuItem>
                  <MenuItem value="vendor">Vendors</MenuItem>
                  <MenuItem value="customer">Customers</MenuItem>
                  <MenuItem value="delivery_partner">Delivery Partners</MenuItem>
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user, index) => (
                <TableRow key={user.user_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`/users/${user.user_image}`}
                        alt={user.username}
                        sx={{ mr: 2 }}
                      />
                      <Typography>{user.username}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.email}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.phone_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.user_type}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleView(user)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.user_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={3}>
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
      </Box>
    </>
  );
}
