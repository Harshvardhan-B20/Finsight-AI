const pool = require("../config/db");

const createTransaction = async ({
  userId,
  type,
  description,
  category,
  amount,
  status = "completed",
  transactionDate,
}) => {
  const result = await pool.query(
    `
    INSERT INTO transactions
    (
      user_id,
      type,
      description,
      category,
      amount,
      status,
      transaction_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `,
    [
      userId,
      type,
      description,
      category,
      amount,
      status,
      transactionDate,
    ]
  );

  return result.rows[0];
};

const getTransactionsByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM transactions
    WHERE user_id = $1
    ORDER BY transaction_date DESC, id DESC;
    `,
    [userId]
  );

  return result.rows;
};

const deleteTransaction = async (transactionId, userId) => {
  const result = await pool.query(
    `
    DELETE FROM transactions
    WHERE id = $1
      AND user_id = $2
    RETURNING *;
    `,
    [transactionId, userId]
  );

  return result.rows[0];
};

const updateTransactionStatus = async (
  transactionId,
  userId,
  status
) => {
  const result = await pool.query(
    `
    UPDATE transactions
    SET status = $1
    WHERE id = $2
      AND user_id = $3
    RETURNING *;
    `,
    [status, transactionId, userId]
  );

  return result.rows[0];
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
  deleteTransaction,
  updateTransactionStatus,
};