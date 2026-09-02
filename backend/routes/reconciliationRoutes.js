const express = require("express");

const {
  getReconciliation,
} = require("../controllers/reconciliationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getReconciliation);

module.exports = router;