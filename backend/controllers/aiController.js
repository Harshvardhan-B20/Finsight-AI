const pool = require("../config/db");

const {
  generateFinancialInsight,
  generateFinancialChatResponse,
} = require("../services/aiService");

const getAIInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get transactions from PostgreSQL
    const result = await pool.query(
      `
      SELECT
        type,
        description,
        category,
        amount,
        status,
        transaction_date
      FROM transactions
      WHERE user_id = $1
      ORDER BY transaction_date DESC, id DESC;
      `,
      [userId]
    );

    const transactions = result.rows;

    // Handle account with no transactions
    if (transactions.length === 0) {
      return res.status(200).json({
        status: "success",
        insights: {
          title: "No financial data yet.",
          message:
            "Add transactions to receive personalized financial insights.",
          recommendation:
            "Start recording your income and expenses to understand your cash flow.",
          transactionCount: 0,
          income: 0,
          expenses: 0,
          balance: 0,
          savingsRate: 0,
          highestExpenseCategory: null,
          highestExpenseAmount: 0,
          aiAnalysis: null,
        },
      });
    }

    // Calculate income and expenses
    let income = 0;
    let expenses = 0;

    const categoryTotals = {};

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount || 0);

      if (transaction.type === "income") {
        income += amount;
      }

      if (transaction.type === "expense") {
        expenses += amount;

        const category = transaction.category || "Other";

        categoryTotals[category] =
          (categoryTotals[category] || 0) + amount;
      }
    });

    // Calculate balance
    const balance = income - expenses;

    // Calculate savings rate
    const savingsRate =
      income > 0 ? (balance / income) * 100 : 0;

    // Find highest expense category
    let highestExpenseCategory = null;
    let highestExpenseAmount = 0;

    Object.entries(categoryTotals).forEach(
      ([category, amount]) => {
        if (amount > highestExpenseAmount) {
          highestExpenseCategory = category;
          highestExpenseAmount = amount;
        }
      }
    );

    // Prepare data for AI
    const financialData = {
      transactionCount: transactions.length,
      income,
      expenses,
      balance,
      savingsRate: Number(savingsRate.toFixed(2)),
      highestExpenseCategory,
      highestExpenseAmount,
      transactions,
    };

    // Generate AI analysis
    const aiResult =
      await generateFinancialInsight(financialData);

    // Return financial data and AI analysis
    return res.status(200).json({
      status: "success",
      insights: {
        title: aiResult.title,
        message: aiResult.summary,
        recommendation: aiResult.recommendation,
        transactionCount: transactions.length,
        income,
        expenses,
        balance,
        savingsRate: Number(savingsRate.toFixed(2)),
        highestExpenseCategory,
        highestExpenseAmount,
        aiAnalysis: aiResult,
      },
    });
  } catch (error) {
    console.error("Get AI insights error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to generate AI insights",
    });
  }
};
const chatWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Question is required",
      });
    }

    // Get only the logged-in user's transactions
    const result = await pool.query(
      `
      SELECT
        type,
        description,
        category,
        amount,
        status,
        transaction_date
      FROM transactions
      WHERE user_id = $1
      ORDER BY transaction_date DESC, id DESC;
      `,
      [userId]
    );

    const transactions = result.rows;

    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount || 0);

      if (transaction.type === "income") {
        income += amount;
      }

      if (transaction.type === "expense") {
        expenses += amount;
      }
    });

    const balance = income - expenses;

    const savingsRate =
      income > 0 ? (balance / income) * 100 : 0;

    const financialData = {
      transactionCount: transactions.length,
      income,
      expenses,
      balance,
      savingsRate: Number(savingsRate.toFixed(2)),
      transactions,
    };

    const answer = await generateFinancialChatResponse(
      question.trim(),
      financialData
    );

    return res.status(200).json({
      status: "success",
      answer,
    });
  } catch (error) {
    console.error("AI chat error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to process AI chat",
    });
  }
};
module.exports = {
  getAIInsights,
  chatWithAI,
};
