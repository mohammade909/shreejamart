import React, { useState, useEffect } from "react";
import {
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { fetchPartnerProfile } from "../../redux/partnersSlice";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  FilePresent as DocumentIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  BsBank as BankIcon,
  BsCreditCard as CreditCard,
  BsWallet as WalletIcon,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Ban, Bike } from "lucide-react";
import { LuBike, LuMail, LuPhone } from "react-icons/lu";

const PartnerProfile = () => {
  const dispatch = useDispatch();
  const { partner } = useSelector((state) => state.partners);
  const { auth } = useSelector((state) => state.auth);
  const [openDocumentModal, setOpenDocumentModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPartnerProfile(auth.user_id));
  }, [auth]);
  const handleOpenDocuments = () => {
    setOpenDocumentModal(true);
  };

  const handleCloseDocuments = () => {
    setOpenDocumentModal(false);
  };

  console.log(partner);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="container mx-auto flex items-center space-x-4">
          <Avatar
            className="w-24 h-24 text-4xl border-4 border-white"
            sx={{ bgcolor: "primary.main" }}
          >
            {partner?.firstname?.toUpperCase()}
          </Avatar>
          <div>
            <Typography variant="h4" className="font-bold">
              {partner?.firstname} {partner?.lastname}
            </Typography>
            <Typography variant="subtitle1">@{partner?.username}</Typography>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        {/* Personal Information Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <Typography variant="h6" className="border-b pb-2 flex items-center">
            <PersonIcon className="mr-2" /> Personal Information
          </Typography>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <LuMail />
              <Typography>{partner?.email}</Typography>
            </div>
            <div className="flex items-center space-x-3">
              <LuPhone />
              <Typography>{partner?.phone_number}</Typography>
            </div>
            <div className="flex items-center space-x-3">
              <LuBike />
              <Typography>{partner?.vehicle_model}({partner?.vehicle_no})</Typography>
            </div>
          </div>
        </div>

        {/* Account Status Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <Typography variant="h6" className="border-b pb-2">
            Account Status
          </Typography>
          <div className="flex justify-between items-center">
            <Chip
              icon={<PersonIcon />}
              label={`Status: ${partner?.partner_status}`}
              color={
                partner?.partner_status === "active" ? "success" : "default"
              }
              className="mr-2"
            />
            <Chip
              icon={partner?.kyc_status === "verified" ? <RiVerifiedBadgeFill /> : <Ban/>}
              label={`KYC`}
              color={partner?.kyc_status === "verified" ? "success" : "error"}
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <Typography variant="h6" className="border-b pb-2 flex items-center">
            <WalletIcon className="mr-2" /> Financial Details
          </Typography>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <WalletIcon color="primary" />
              <Typography>
                Wallet Balance: ${partner?.wallet_balance}
              </Typography>
            </div>
            <div className="flex items-center space-x-3">
              <BankIcon color="primary" />
              <Typography>Bank: {partner?.bank_name}</Typography>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard color="primary" />
              <Typography>Account Number: {partner?.account_number}</Typography>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard color="primary" />
              <Typography>IFSC Code: {partner?.ifsc_code}</Typography>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <Typography variant="h6" className="border-b pb-2 flex items-center">
            <DocumentIcon className="mr-2" /> Documents
          </Typography>
          <div className="space-y-3">
            {partner?.documents?.map((doc, index) => (
              <div key={index} className="flex items-center space-x-3">
                <DocumentIcon color="primary" />
                <Typography>
                  {doc.document_type.replace("_", " ").toUpperCase()}
                </Typography>
              </div>
            ))}
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleOpenDocuments}
            >
              View Documents
            </Button>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      <Dialog
        open={openDocumentModal}
        onClose={handleCloseDocuments}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Uploaded Documents</DialogTitle>
        <DialogContent>
          {partner?.documents?.map((doc, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <DocumentIcon color="primary" />
              <div>
                <Typography variant="subtitle1">
                  {doc.document_type.replace("_", " ").toUpperCase()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Uploaded at: {new Date(doc.uploaded_at).toLocaleString()}
                </Typography>
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDocuments}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PartnerProfile;
