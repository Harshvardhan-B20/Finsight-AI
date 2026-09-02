const express = require("express");

const {
  getAIInsights,
  chatWithAI,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/insights", authMiddleware, getAIInsights);

router.post("/chat", authMiddleware, chatWithAI);

module.exports = router;