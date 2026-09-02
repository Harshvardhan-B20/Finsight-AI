const {
  getFinancialSummary,
  getMonthlyCashFlow,
  getCategoryExpenses,
} = require("../models/analyticsModel");

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const summary = await getFinancialSummary(userId);
    const monthlyCashFlow = await getMonthlyCashFlow(userId);
    const categoryExpenses = await getCategoryExpenses(userId);

    res.status(200).json({
      status: "success",
      analytics: {
        summary,
        monthlyCashFlow,
        categoryExpenses,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch analytics",
    });
  }
};

module.exports = {
  getAnalytics,
};
