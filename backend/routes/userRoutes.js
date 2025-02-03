const express = require("express");
const { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getUserProfile
} = require("../controllers/userController");

const router = express.Router();

router.route("/").post(createUser).get(getUsers);
router.route("/:id").get(getUserProfile).put(updateUser).delete(deleteUser);
// router.route("/profile/:userId").get(getUserProfile);

module.exports = router;
