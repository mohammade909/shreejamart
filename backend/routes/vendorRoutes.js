const experss = require("express");
const router = experss.Router();

const { isAuthenticatedUser } = require("../middlewares/authMiddleware");
const { createVendor, getAllVendors, updateVendor, deleteVendor , getVendorById, getVendorProfile, getVendorMetrics} = require("../controllers/vendorController");
router.route('/').post(createVendor).get(getAllVendors);
router.route('/:vendor_id').put(updateVendor).delete(deleteVendor).get(getVendorById)
router.route('/user/:user_id').get(getVendorProfile)
router.route('/matrics/:vendor_id').get(getVendorMetrics)


module.exports = router;
