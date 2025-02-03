const express = require("express");
const {
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
  createPartner,
  getPartnerProfile,
  // getPartnerStats,
  getPartnerEarnings,
  getPartnerOrderStats
} = require("../controllers/partnerController"); // Adjust path to your controller file

const router = express.Router();

// Route to get all partners with filters and pagination
router.get("/", getAllPartners);
router.post("/", createPartner);

// Route to get a partner by ID
router.get("/:partner_id", getPartnerById);
router.get("/profile/:user_id", getPartnerProfile);
router.get("/earnings/:partnerId", getPartnerEarnings);
router.get("/orders/:partnerId", getPartnerOrderStats);
// router.get("/matrix/:partner_id", getPartnerStats);

// Route to update a partner dynamically
router.put("/:partner_id", updatePartner);
router.delete("/:partner_id", deletePartner);

module.exports = router;
