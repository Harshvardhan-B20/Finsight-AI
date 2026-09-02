const express = require("express");

const {
  addTransaction,
  getUserTransactions,
  removeTransaction,
  changeTransactionStatus,
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addTransaction);

router.get("/", authMiddleware, getUserTransactions);

router.delete("/:id", authMiddleware, removeTransaction);

router.put(
  "/:id/status",
  authMiddleware,
  changeTransactionStatus
);

module.exports = router;