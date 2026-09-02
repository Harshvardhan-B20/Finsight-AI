const {
  getReconciliationData,
} = require("../models/reconciliationModel");

const getReconciliation = async (req, res) => {
  try {
    const userId = req.user.id;

    const reconciliation =
      await getReconciliationData(userId);

    res.status(200).json({
      status: "success",
      reconciliation,
    });
  } catch (error) {
    console.error(
      "Get reconciliation error:",
      error
    );

    res.status(500).json({
      status: "error",
      message: "Failed to fetch reconciliation data",
    });
  }
};

module.exports = {
  getReconciliation,
};