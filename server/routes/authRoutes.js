const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  logout,
  getProfile,
} = require("../controllers/authController");

const auth = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", auth, getProfile);

module.exports = router;
