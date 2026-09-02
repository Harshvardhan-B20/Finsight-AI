const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ========================================
// FINANCIAL INSIGHT
// ========================================

const generateFinancialInsight = async (financialData) => {
  const {
    transactionCount,
    income,
    expenses,
    balance,
    savingsRate,
    highestExpenseCategory,
    highestExpenseAmount,
    transactions,
  } = financialData;

  try {
    const prompt = `
You are FinSight AI, a financial analysis assistant for businesses.

Analyze the following financial data and provide a concise, practical financial analysis.

Financial data:
- Total transactions: ${transactionCount}
- Total income: ₹${income}
- Total expenses: ₹${expenses}
- Balance: ₹${balance}
- Savings rate: ${savingsRate}%
- Highest expense category: ${
      highestExpenseCategory || "None"
    }
- Highest expense amount: ₹${highestExpenseAmount}

Transactions:
${JSON.stringify(transactions, null, 2)}

Return ONLY valid JSON in exactly this structure:

{
  "title": "short financial assessment",
  "summary": "2-3 sentence summary of the financial situation",
  "recommendation": "specific recommendation based on the data",
  "risk": "Low, Medium, or High",
  "action": "one practical next action"
}

Do not use markdown.
Do not include code fences.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    const text = response.text.trim();

    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error(
      "Gemini AI analysis failed:",
      error.message
    );

    let title;
    let risk;

    if (balance > 0 && savingsRate >= 50) {
      title = "Your cash flow looks healthy.";
      risk = "Low";
    } else if (balance > 0) {
      title =
        "Your finances are positive, but spending should be monitored.";
      risk = "Medium";
    } else {
      title =
        "Your expenses are higher than your income.";
      risk = "High";
    }

    const summary =
      `FinSight analyzed ${transactionCount} transactions. ` +
      `You generated ₹${income.toLocaleString("en-IN")} ` +
      `in income and ₹${expenses.toLocaleString("en-IN")} ` +
      `in expenses, leaving a balance of ₹${balance.toLocaleString(
        "en-IN"
      )}.`;

    const recommendation = highestExpenseCategory
      ? `Your highest expense category is ${highestExpenseCategory} ` +
        `at ₹${highestExpenseAmount.toLocaleString(
          "en-IN"
        )}. Review this category regularly and ensure the spending is aligned with your business priorities.`
      : "Continue tracking your income and expenses regularly to maintain visibility into your cash flow.";

    const action =
      balance > 0
        ? "Review your largest expense category and allocate part of your surplus toward an emergency reserve or future business needs."
        : "Review your expenses and identify areas where spending can be reduced.";

    return {
      title,
      summary,
      recommendation,
      risk,
      action,
    };
  }
};

// ========================================
// AI CHAT
// ========================================

const generateFinancialChatResponse = async (
  question,
  financialData
) => {
  const {
    transactionCount,
    income,
    expenses,
    balance,
    savingsRate,
    transactions,
  } = financialData;

  const lowerQuestion = question.toLowerCase();
  const normalizedQuestion = lowerQuestion
  .replace(/[?!.,]/g, "")
  .replace(/\s+/g, " ")
  .trim();
  console.log("AI question:", normalizedQuestion);

  // ========================================
  // CURRENT BALANCE
  // ========================================

  if (
    lowerQuestion.includes("balance") ||
    lowerQuestion.includes("financial position") ||
    lowerQuestion.includes("how much money do i have")
  ) {
    return (
      `Your current recorded balance is ₹${balance.toLocaleString(
        "en-IN"
      )}. ` +
      `You have ₹${income.toLocaleString(
        "en-IN"
      )} in income and ₹${expenses.toLocaleString(
        "en-IN"
      )} in expenses.`
    );
  }

  // ========================================
  // TOTAL INCOME
  // ========================================

  if (
    lowerQuestion.includes("total income") ||
    lowerQuestion.includes("total revenue") ||
    lowerQuestion.includes("how much income") ||
    lowerQuestion.includes("how much revenue") ||
    lowerQuestion.includes("income do i have")
  ) {
    return (
      `Your total recorded income is ₹${income.toLocaleString(
        "en-IN"
      )}.`
    );
  }

  // ========================================
  // TOTAL EXPENSES
  // ========================================

  if (
    lowerQuestion.includes("total expense") ||
    lowerQuestion.includes("total expenses") ||
    lowerQuestion.includes("total spending") ||
    lowerQuestion.includes("how much did i spend") ||
    lowerQuestion.includes("how much have i spent")
  ) {
    return (
      `Your total recorded expenses are ₹${expenses.toLocaleString(
        "en-IN"
      )}.`
    );
  }

  // ========================================
  // SAVINGS RATE
  // ========================================

  if (
    lowerQuestion.includes("savings rate") ||
    lowerQuestion.includes("saving rate") ||
    lowerQuestion.includes("how much am i saving") ||
    lowerQuestion.includes("how much do i save")
  ) {
    return (
      `Your current savings rate is ${savingsRate}%.`
    );
  }

  // ========================================
  // TRANSACTION COUNT
  // ========================================

  if (
    lowerQuestion.includes("number of transactions") ||
    lowerQuestion.includes("how many transactions") ||
    lowerQuestion.includes("transaction count") ||
    lowerQuestion.includes("how many transactions do i have")
  ) {
    return (
      `You currently have ${transactionCount} recorded transactions.`
    );
  }

  // ========================================
  // HIGHEST EXPENSE
  // ========================================

  if (
    lowerQuestion.includes("highest expense") ||
    lowerQuestion.includes("largest expense") ||
    lowerQuestion.includes("biggest expense") ||
    lowerQuestion.includes("highest spending") ||
    lowerQuestion.includes("largest spending")
  ) {
    const expenseTotals = {};

    transactions.forEach((transaction) => {
      if (transaction.type !== "expense") return;

      const category = transaction.category || "Other";
      const amount = Number(transaction.amount || 0);

      expenseTotals[category] =
        (expenseTotals[category] || 0) + amount;
    });

    const highest = Object.entries(expenseTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    if (!highest) {
      return "There are no recorded expenses to analyze.";
    }

    return (
      `Your highest expense category is ${highest[0]} ` +
      `with ₹${highest[1].toLocaleString(
        "en-IN"
      )} in recorded spending.`
    );
  }

  // ========================================
  // RENT EXPENSE
  // ========================================

  if (
    lowerQuestion.includes("rent") &&
    (
      lowerQuestion.includes("spend") ||
      lowerQuestion.includes("expense") ||
      lowerQuestion.includes("paid") ||
      lowerQuestion.includes("cost") ||
      lowerQuestion.includes("amount")
    )
  ) {
    const rentTotal = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          (
            String(transaction.category || "")
              .toLowerCase()
              .includes("rent") ||
            String(transaction.description || "")
              .toLowerCase()
              .includes("rent")
          )
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    return (
      `Your recorded spending on rent is ₹${rentTotal.toLocaleString(
        "en-IN"
      )}.`
    );
  }

  // ========================================
  // FINANCIAL HEALTH
  // ========================================

  if (
    lowerQuestion.includes("financial health") ||
    lowerQuestion.includes("financially healthy") ||
    lowerQuestion.includes("financial health status")
  ) {
    let assessment;

    if (balance < 0) {
      assessment =
        "Your financial position needs attention because your recorded expenses are higher than your income.";
    } else if (savingsRate >= 50) {
      assessment =
        "Your financial position looks healthy. You are maintaining a strong positive balance and savings rate.";
    } else if (savingsRate >= 20) {
      assessment =
        "Your financial position is positive, but there is room to improve your savings rate.";
    } else {
      assessment =
        "Your financial position is positive, but your savings rate is relatively low and spending should be monitored.";
    }

    return (
      `${assessment} ` +
      `Your current balance is ₹${balance.toLocaleString(
        "en-IN"
      )}, with a savings rate of ${savingsRate}%.`
    );
  }

  // ========================================
  // WHY REDUCE EXPENSES?
  // ========================================

  if (
    lowerQuestion.includes("why should i reduce") ||
    lowerQuestion.includes("why should i cut") ||
    lowerQuestion.includes("why reduce expenses") ||
    lowerQuestion.includes("why reduce my expenses") ||
    lowerQuestion.includes("why cut expenses") ||
    lowerQuestion.includes("why cut my expenses") ||
    lowerQuestion.includes("reduce my expenses") ||
    lowerQuestion.includes("reduce expenses") ||
    lowerQuestion.includes("cut my expenses") ||
    lowerQuestion.includes("cut expenses")
  ) {
    if (balance > 0) {
      return (
        `Reducing unnecessary expenses can help you preserve more of your ` +
        `₹${balance.toLocaleString("en-IN")} current balance and improve your ` +
        `financial safety. Your recorded expenses are ₹${expenses.toLocaleString(
          "en-IN"
        )}, compared with ₹${income.toLocaleString(
          "en-IN"
        )} in income. ` +
        `Focus first on your largest expense categories and reduce spending that ` +
        `does not directly support your business goals.`
      );
    }

    return (
      `Reducing expenses is important because your recorded spending is currently ` +
      `higher than your income. Cutting unnecessary costs can help improve your ` +
      `cash flow and move your financial position toward a positive balance.`
    );
  }

  // ========================================
  // SPENDING ANALYSIS
  // ========================================

  if (
    lowerQuestion.includes("analyze my spending") ||
    lowerQuestion.includes("analyse my spending") ||
    lowerQuestion.includes("analyze spending") ||
    lowerQuestion.includes("analyse spending") ||
    lowerQuestion.includes("spending pattern") ||
    lowerQuestion.includes("spending patterns")
  ) {
    const expenseTotals = {};

    transactions.forEach((transaction) => {
      if (transaction.type !== "expense") return;

      const category = transaction.category || "Other";
      const amount = Number(transaction.amount || 0);

      expenseTotals[category] =
        (expenseTotals[category] || 0) + amount;
    });

    const categories = Object.entries(expenseTotals)
      .sort((a, b) => b[1] - a[1]);

    if (categories.length === 0) {
      return "There are no recorded expenses available for spending analysis.";
    }

    const topCategory = categories[0];

    return (
      `Your recorded spending totals ₹${expenses.toLocaleString(
        "en-IN"
      )}. ` +
      `The largest expense category is ${topCategory[0]}, ` +
      `with ₹${topCategory[1].toLocaleString(
        "en-IN"
      )}. ` +
      `Review your largest categories first to identify unnecessary spending ` +
      `and improve your cash flow.`
    );
  }

  // ========================================
  // GEMINI FOR DEEPER QUESTIONS
  // ========================================

  try {
    const prompt = `
You are FinSight AI, an intelligent financial assistant for a business.

Answer the user's question using ONLY the financial data provided.

IMPORTANT RULES:

- Never invent financial information.
- Never invent transactions, amounts, categories, or dates.
- Use the transaction data when the question requires detailed analysis.
- Explain calculations clearly when useful.
- Keep the answer concise and practical.
- If the available data is insufficient, say so.
- Do not provide regulated financial advice.
- Do not use markdown tables.
- Respond in plain text.

Financial summary:
- Total transactions: ${transactionCount}
- Total income: ₹${income}
- Total expenses: ₹${expenses}
- Current balance: ₹${balance}
- Savings rate: ${savingsRate}%

Transaction data:
${JSON.stringify(transactions, null, 2)}

User question:
${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error(
      "Gemini AI chat failed:",
      error.message
    );

    // ========================================
    // SAFE FALLBACK
    // ========================================

    return (
      `I couldn't connect to the AI analysis service right now. ` +
      `Your current recorded balance is ₹${balance.toLocaleString(
        "en-IN"
      )}, with ₹${income.toLocaleString(
        "en-IN"
      )} income and ₹${expenses.toLocaleString(
        "en-IN"
      )} expenses.`
    );
  }
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  generateFinancialInsight,
  generateFinancialChatResponse,
};