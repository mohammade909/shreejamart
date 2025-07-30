import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPartners, updatePartner } from "../../../redux/partnersSlice";
import toast from 'react-hot-toast'
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Verified
} from "@mui/icons-material";

const PartnersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { partners, pagination, status, error } = useSelector((state) => state.partners);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    dispatch(
      fetchPartners({
        page: pagination.page,
        limit: pagination.limit,
        search,
        partner_status: statusFilter,
      })
    );
  }, [dispatch, pagination.page, pagination.limit, search, statusFilter]);

  const handlePageChange = (newPage) => {
    dispatch(
      fetchPartners({
        page: newPage,
        limit: pagination.limit,
        search,
        status: statusFilter,
      })
    );
  };

  const handleStatusChange = async (partnerId, newStatus) => {
    setUpdating(partnerId);
    try {
      await dispatch(
        updatePartner({ 
          partnerId, 
          updatedData: { kyc_status: newStatus } 
        })
      ).unwrap();
      toast.success("Status updated successfully!");
      dispatch(
        fetchPartners({
          page: pagination.page,
          limit: pagination.limit,
          search,
          partner_status: statusFilter,
        })
      );
    } finally {
      setUpdating(null);
    }
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case "verified":
        return { color: "success", sx: { background: "#e6f4ea" } };
      case "rejected":
        return { color: "error", sx: { background: "#fde7e7" } };
      default:
        return { color: "warning", sx: { background: "#fff4e5" } };
    }
  };

  const activePartners = partners.filter(p => p.partner_status === "active").length;
  const inactivePartners = partners.filter(p => p.partner_status === "inactive").length;
  const verifiedPartners = partners.filter(p => p.kyc_status === "verified").length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Partners Management
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography color="textSecondary" gutterBottom>
                    Total Partners
                  </Typography>
                  <PersonIcon color="action" />
                </Box>
                <Typography variant="h4">{partners.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography color="textSecondary" gutterBottom>
                    Active Partners
                  </Typography>
                  <CheckCircleIcon color="success" />
                </Box>
                <Typography variant="h4" color="success.main">
                  {activePartners}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography color="textSecondary" gutterBottom>
                    Inactive Partners
                  </Typography>
                  <CancelIcon color="error" />
                </Box>
                <Typography variant="h4" color="error.main">
                  {inactivePartners}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography color="textSecondary" gutterBottom>
                    Verified
                  </Typography>
                  <Verified color="success" />
                </Box>
                <Typography variant="h4" color="success.main">
                  {verifiedPartners}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="Search partners"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter by status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>KYC Status</TableCell>
                <TableCell>Wallet Balance</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {status === "loading" ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : partners.map((partner) => (
                <TableRow key={partner.partner_id}>
                  <TableCell>
                    {partner.firstname} {partner.lastname}
                  </TableCell>
                  <TableCell>{partner.username}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.phone_number}</TableCell>
                  <TableCell>
                    <Chip
                      label={partner.partner_status}
                      color={partner.partner_status === "active" ? "success" : "error"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={partner.kyc_status}
                        onChange={(e) => handleStatusChange(partner.partner_id, e.target.value)}
                        disabled={updating === partner.partner_id}
                        size="small"
                        {...getStatusChipProps(partner.kyc_status)}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="verified">Verified</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{partner.wallet_balance}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/dashboard/partners/${partner.partner_id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={3}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<NavigateBeforeIcon />}
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <Typography variant="body2" color="text.secondary">
            Page {pagination.page} of {pagination.totalPages}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            endIcon={<NavigateNextIcon />}
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PartnersList;