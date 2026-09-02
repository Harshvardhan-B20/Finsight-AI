const pool = require("../config/db");

const getReconciliationData = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      description,
      category,
      type,
      amount,
      transaction_date,
      status
    FROM transactions
    WHERE user_id = $1
    ORDER BY transaction_date DESC, id DESC;
    `,
    [userId]
  );

  const transactions = result.rows;

  const matched = transactions.filter(
    (transaction) => transaction.status === "completed"
  );

  const pending = transactions.filter(
    (transaction) => transaction.status !== "completed"
  );

  const totalAmount = transactions.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

  const matchedAmount = matched.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

  const pendingAmount = pending.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

  return {
    summary: {
      totalTransactions: transactions.length,
      matchedTransactions: matched.length,
      pendingTransactions: pending.length,
      totalAmount,
      matchedAmount,
      pendingAmount,
    },
    transactions,
  };
};

module.exports = {
  getReconciliationData,
};