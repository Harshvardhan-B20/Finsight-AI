const {
  createTransaction,
  getTransactionsByUser,
  deleteTransaction,
  updateTransactionStatus,
} = require("../models/transactionModel");

const addTransaction = async (req, res) => {
  try {
    const {
      type,
      description,
      category,
      amount,
      status,
      transaction_date,
    } = req.body;

    if (!type || !description || !category || amount === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Type, description, category, and amount are required",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        status: "error",
        message: "Type must be income or expense",
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        status: "error",
        message: "Amount cannot be negative",
      });
    }

    const transaction = await createTransaction({
      userId: req.user.id,
      type,
      description,
      category,
      amount,
      status: status || "completed",
      transactionDate: transaction_date || new Date(),
    });

    res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Add transaction error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to create transaction",
    });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const transactions = await getTransactionsByUser(req.user.id);

    res.status(200).json({
      status: "success",
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch transactions",
    });
  }
};

const removeTransaction = async (req, res) => {
  try {
    const transactionId = Number(req.params.id);

    if (!Number.isInteger(transactionId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid transaction ID",
      });
    }

    const transaction = await deleteTransaction(
      transactionId,
      req.user.id
    );

    if (!transaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Transaction deleted successfully",
      transaction,
    });
  } catch (error) {
    console.error("Delete transaction error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to delete transaction",
    });
  }
};

const changeTransactionStatus = async (req, res) => {
  try {
    const transactionId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(transactionId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid transaction ID",
      });
    }

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Status must be pending or completed",
      });
    }

    const transaction = await updateTransactionStatus(
      transactionId,
      req.user.id,
      status
    );

    if (!transaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Transaction status updated successfully",
      transaction,
    });
  } catch (error) {
    console.error(
      "Change transaction status error:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to update transaction status",
    });
  }
};

module.exports = {
  addTransaction,
  getUserTransactions,
  removeTransaction,
  changeTransactionStatus,
};