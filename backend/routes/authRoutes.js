const experss = require("express");
const router = experss.Router();

const { isAuthenticatedUser } = require("../middlewares/authMiddleware");
const {
  signin,
  signout,
  forgotPassword,
  getServerStatus,
  shutdownServer,
  restartServer,
  resetPassword,
  signup,
  getDashboardMatrix,
  getProfile,
  getOrderMetrics,
} = require("../controllers/authController");
router.post("/signin", signin);
router.post("/signup", signup);
router.get("/signout", signout);
router.get("/", isAuthenticatedUser, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/shutdown", shutdownServer);
router.get("/matrix", getDashboardMatrix,)
router.get("/orders/matrix", getOrderMetrics,)
router.get("/status", getServerStatus);
module.exports = router;
