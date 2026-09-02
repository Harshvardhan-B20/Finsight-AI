const express = require("express");

const {
  registerUser,
  loginUser,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/profile", authMiddleware, updateProfile);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    status: "success",
    user: req.user,
  });
});

module.exports = router;
