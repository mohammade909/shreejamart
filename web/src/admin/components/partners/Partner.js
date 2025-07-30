import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPartnerById } from "../../../redux/partnersSlice";

import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccountBalance as WalletIcon,
  VerifiedUser as VerifiedIcon,
  CalendarToday as CalendarIcon,
  DirectionsBike as BikeIcon,
  DriveEta as LicenseIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Partner = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { partner } = useSelector((state) => state.partners);
  useEffect(() => {
    dispatch(fetchPartnerById(id));
  }, [dispatch, id]);
  if (!partner) {
    return <p>No partner details available.</p>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'verified':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {/* {partner?.firstname.charAt(0)}{partner?.lastname.charAt(0)} */}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {partner.firstname} {partner.lastname}
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip 
                    label={`Status: ${partner.partner_status}`}
                    color={getStatusColor(partner.partner_status)}
                    icon={<VerifiedIcon />}
                  />
                  <Chip 
                    label={`KYC: ${partner.kyc_status}`}
                    color={getStatusColor(partner.kyc_status)}
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" /> Basic Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Username"
                      secondary={partner.username}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email"
                      secondary={partner.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone"
                      secondary={partner.phone_number}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Address"
                      secondary={partner.address || "Not provided"}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Account Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WalletIcon color="primary" /> Account Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <WalletIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Wallet Balance"
                      secondary={`₹ ${partner.wallet_balance}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Member Since"
                      secondary={formatDate(partner.created_at)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Last Updated"
                      secondary={formatDate(partner.updated_at)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Documents */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedIcon color="primary" /> Documents
                </Typography>
                <Grid container spacing={2}>
                  {partner?.documents?.map((doc) => (
                    <Grid item xs={12} md={6} key={doc.document_type}>
                      <Paper sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                          {doc.document_type === 'bike_rc' ? (
                            <BikeIcon color="primary" fontSize="large" />
                          ) : (
                            <LicenseIcon color="primary" fontSize="large" />
                          )}
                          <Box flex={1}>
                            <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                              {doc.document_type?.replace('_', ' ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Uploaded: {formatDate(doc.uploaded_at)}
                            </Typography>
                          </Box>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => window.open(doc.file_path, '_blank')}
                          >
                            View
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Partner;