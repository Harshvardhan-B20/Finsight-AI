const pool = require("../config/db");

const getFinancialSummary = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      COALESCE(
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),
        0
      ) AS total_income,

      COALESCE(
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
        0
      ) AS total_expenses,

      COUNT(*) AS total_transactions

    FROM transactions
    WHERE user_id = $1;
    `,
    [userId]
  );

  const row = result.rows[0];

  const income = Number(row.total_income);
  const expenses = Number(row.total_expenses);
  const balance = income - expenses;

  const savingsRate =
    income > 0 ? (balance / income) * 100 : 0;

  return {
    income,
    expenses,
    balance,
    savingsRate,
    totalTransactions: Number(row.total_transactions),
  };
};

const getMonthlyCashFlow = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      TO_CHAR(transaction_date, 'Mon') AS month,
      DATE_TRUNC('month', transaction_date) AS month_date,

      COALESCE(
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END),
        0
      ) AS income,

      COALESCE(
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END),
        0
      ) AS expenses

    FROM transactions
    WHERE user_id = $1
    GROUP BY month, month_date
    ORDER BY month_date ASC;
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    month: row.month,
    income: Number(row.income),
    expenses: Number(row.expenses),
  }));
};

const getCategoryExpenses = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      category,
      COALESCE(SUM(amount), 0) AS total

    FROM transactions
    WHERE user_id = $1
      AND type = 'expense'

    GROUP BY category
    ORDER BY total DESC;
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    category: row.category,
    total: Number(row.total),
  }));
};

module.exports = {
  getFinancialSummary,
  getMonthlyCashFlow,
  getCategoryExpenses,
};
