import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://127.0.0.1:5100";

function Dashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState("");

  const [chartMonths, setChartMonths] = useState(6);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userName = user.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  /*
   * =========================================================
   * FETCH TRANSACTIONS
   * =========================================================
   */

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );
        setLoadingTransactions(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/transactions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const contentType =
          response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();

          console.error(
            "Transactions endpoint returned non-JSON:",
            text
          );

          throw new Error(
            `Server returned an unexpected response (${response.status}).`
          );
        }

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch transactions."
          );
        }

        setTransactions(
          Array.isArray(data?.transactions)
            ? data.transactions
            : []
        );
      } catch (err) {
        console.error("Transaction fetch error:", err);

        setError(
          err.message || "Unable to load transactions."
        );
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  /*
   * =========================================================
   * CURRENCY
   * =========================================================
   */

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  /*
   * =========================================================
   * DATE
   * =========================================================
   */

  const formatDate = (date) => {
    if (!date) return "";

    const transactionDate = new Date(date);

    if (Number.isNaN(transactionDate.getTime())) {
      return "";
    }

    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      transactionDate.toDateString() ===
      today.toDateString()
    ) {
      return "Today";
    }

    if (
      transactionDate.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Yesterday";
    }

    return transactionDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /*
   * =========================================================
   * FINANCIAL SUMMARY
   * =========================================================
   */

  const financialSummary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let completedIncome = 0;
    let completedExpenses = 0;
    let pendingCount = 0;

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount || 0);

      if (transaction.status === "pending") {
        pendingCount += 1;
      }

      if (transaction.type === "income") {
        income += amount;

        if (transaction.status === "completed") {
          completedIncome += amount;
        }
      }

      if (transaction.type === "expense") {
        expenses += amount;

        if (transaction.status === "completed") {
          completedExpenses += amount;
        }
      }
    });

    const balance = income - expenses;

    const savingsRate =
      income > 0 ? (balance / income) * 100 : 0;

    const expenseRatio =
      income > 0 ? (expenses / income) * 100 : 0;

    return {
      income,
      expenses,
      balance,
      savingsRate,
      expenseRatio,
      completedIncome,
      completedExpenses,
      pendingCount,
      totalTransactions: transactions.length,
    };
  }, [transactions]);

  /*
   * =========================================================
   * EXPENSE BREAKDOWN
   * =========================================================
   */

  const expenseBreakdown = useMemo(() => {
    const totals = {};

    transactions.forEach((transaction) => {
      if (transaction.type !== "expense") {
        return;
      }

      const category =
        transaction.category?.trim() || "Uncategorized";

      totals[category] =
        (totals[category] || 0) +
        Number(transaction.amount || 0);
    });

    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const topExpense =
    expenseBreakdown[0] || null;

  /*
   * =========================================================
   * FINANCIAL HEALTH SCORE
   * =========================================================
   *
   * 40 points - savings performance
   * 25 points - cash flow
   * 20 points - expense control
   * 15 points - spending concentration
   *
   * Application-level indicator only.
   * Not financial advice.
   * =========================================================
   */

  const financialHealth = useMemo(() => {
    const {
      income,
      expenses,
      balance,
      savingsRate,
      expenseRatio,
    } = financialSummary;

    if (income <= 0) {
      return {
        score: transactions.length > 0 ? 30 : 0,
        label: transactions.length > 0
          ? "Needs Data"
          : "No Data",
        status: "Review",
        description:
          "Add income transactions to calculate a complete financial health score.",
      };
    }

    let score = 0;

    /*
     * Savings performance
     * Maximum 40 points.
     */

    score += Math.min(
      Math.max(savingsRate, 0),
      40
    );

    /*
     * Cash flow
     * Maximum 25 points.
     */

    if (balance > 0) {
      score += 25;
    } else if (balance === 0) {
      score += 12;
    }

    /*
     * Expense control
     * Maximum 20 points.
     */

    if (expenseRatio <= 30) {
      score += 20;
    } else if (expenseRatio <= 50) {
      score += 15;
    } else if (expenseRatio <= 70) {
      score += 10;
    } else if (expenseRatio <= 90) {
      score += 5;
    }

    /*
     * Spending concentration
     * Maximum 15 points.
     */

    const topCategoryAmount =
      expenseBreakdown[0]?.amount || 0;

    const concentration =
      expenses > 0
        ? (topCategoryAmount / expenses) * 100
        : 0;

    if (concentration <= 25) {
      score += 15;
    } else if (concentration <= 40) {
      score += 12;
    } else if (concentration <= 55) {
      score += 9;
    } else if (concentration <= 70) {
      score += 5;
    }

    const scoreValue = Math.round(
      Math.min(Math.max(score, 0), 100)
    );

    if (scoreValue >= 85) {
      return {
        score: scoreValue,
        label: "Excellent",
        status: "Strong",
        description:
          "Strong savings, positive cash flow, and controlled spending.",
      };
    }

    if (scoreValue >= 70) {
      return {
        score: scoreValue,
        label: "Healthy",
        status: "Stable",
        description:
          "Your financial position is positive with room to improve.",
      };
    }

    if (scoreValue >= 55) {
      return {
        score: scoreValue,
        label: "Moderate",
        status: "Monitor",
        description:
          "Your finances are stable, but spending should be monitored.",
      };
    }

    if (scoreValue >= 35) {
      return {
        score: scoreValue,
        label: "Needs Attention",
        status: "Review",
        description:
          "Your current spending is putting pressure on cash flow.",
      };
    }

    return {
      score: scoreValue,
      label: "At Risk",
      status: "Critical",
      description:
        "Expenses are putting significant pressure on your financial position.",
    };
  }, [
    financialSummary,
    expenseBreakdown,
    transactions.length,
  ]);

  /*
   * =========================================================
   * HEALTH METRICS
   * =========================================================
   */

  const healthMetrics = useMemo(() => {
    const expenseRatio =
      financialSummary.expenseRatio;

    let expenseControl = "Healthy";

    if (expenseRatio > 70) {
      expenseControl = "High spending";
    } else if (expenseRatio > 50) {
      expenseControl = "Moderate";
    } else if (expenseRatio > 30) {
      expenseControl = "Controlled";
    }

    let cashFlowStatus = "Positive";

    if (financialSummary.balance < 0) {
      cashFlowStatus = "Negative";
    } else if (financialSummary.balance === 0) {
      cashFlowStatus = "Break-even";
    }

    let savingsStatus = "Strong";

    if (financialSummary.savingsRate < 10) {
      savingsStatus = "Low";
    } else if (financialSummary.savingsRate < 25) {
      savingsStatus = "Moderate";
    }

    return {
      expenseControl,
      cashFlowStatus,
      savingsStatus,
    };
  }, [financialSummary]);

  /*
   * =========================================================
   * RECENT TRANSACTIONS
   * =========================================================
   */

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(
            b.transaction_date ||
              b.created_at ||
              0
          ) -
          new Date(
            a.transaction_date ||
              a.created_at ||
              0
          )
      )
      .slice(0, 5);
  }, [transactions]);

  /*
   * =========================================================
   * MONTHLY CASH FLOW
   * =========================================================
   */

  const monthlyCashFlow = useMemo(() => {
    const now = new Date();

    return Array.from(
      { length: chartMonths },
      (_, index) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() -
            (chartMonths - 1 - index),
          1
        );

        const year = date.getFullYear();
        const month = date.getMonth();

        let income = 0;
        let expenses = 0;

        transactions.forEach((transaction) => {
          if (!transaction.transaction_date) {
            return;
          }

          const transactionDate = new Date(
            transaction.transaction_date
          );

          if (
            transactionDate.getFullYear() !== year ||
            transactionDate.getMonth() !== month
          ) {
            return;
          }

          const amount = Number(
            transaction.amount || 0
          );

          if (transaction.type === "income") {
            income += amount;
          }

          if (transaction.type === "expense") {
            expenses += amount;
          }
        });

        return {
          month: date.toLocaleDateString("en-IN", {
            month: "short",
          }),
          income,
          expenses,
        };
      }
    );
  }, [transactions, chartMonths]);

  /*
   * =========================================================
   * CHART SCALE
   * =========================================================
   */

  const maxCashFlow = Math.max(
    ...monthlyCashFlow.flatMap((month) => [
      month.income,
      month.expenses,
    ]),
    1
  );

  /*
   * =========================================================
   * AI ANALYSIS
   * =========================================================
   */

  const handleAIAnalysis = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAiError(
        "Authentication token not found. Please login again."
      );
      return;
    }

    setLoadingAI(true);
    setAiError("");
    setAiAnalysis(null);

    try {
      const response = await fetch(
        `${API_URL}/api/ai/insights`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "AI endpoint returned non-JSON:",
          text
        );

        throw new Error(
          `AI server returned an unexpected response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to generate AI analysis."
        );
      }

      if (
        data?.status === "success" &&
        data?.insights
      ) {
        setAiAnalysis(data.insights);
        return;
      }

      if (data?.analysis) {
        setAiAnalysis({
          title: "AI Financial Analysis",
          message: data.analysis,
        });
        return;
      }

      if (data?.insight) {
        setAiAnalysis({
          title: "AI Financial Analysis",
          message: data.insight,
        });
        return;
      }

      throw new Error(
        "AI analysis response was not in the expected format."
      );
    } catch (err) {
      console.error(
        "AI analysis error:",
        err
      );

      setAiError(
        err.message ||
          "Unable to generate AI analysis."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  /*
   * =========================================================
   * HEALTH PROGRESS
   * =========================================================
   */

  const healthProgress =
    `${financialHealth.score}%`;

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="dashboard-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={
          "dashboard-sidebar " +
          (sidebarOpen ? "open" : "")
        }
      >

        <div className="sidebar-top">

          <Link
            to="/"
            className="dashboard-logo"
          >
            FinSight
            <span>AI</span>
          </Link>

          <button
            className="close-sidebar"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

        </div>

        <nav className="sidebar-nav">

          <p className="nav-title">
            MAIN
          </p>

          <Link
            to="/dashboard"
            className="nav-item active"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>

          <Link
            to="/transactions"
            className="nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Receipt size={18} />
            Transactions
          </Link>

          <Link
            to="/analytics"
            className="nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <BarChart3 size={18} />
            Analytics
          </Link>

          <Link
            to="/reconciliation"
            className="nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <CreditCard size={18} />
            Reconciliation
          </Link>

          <p className="nav-title second-title">
            INTELLIGENCE
          </p>

          <a
            href="#ai-insights"
            className="nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <BrainCircuit size={18} />
            AI Insights
          </a>

          <Link
            to="/ai-assistant"
            className="nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Sparkles size={18} />
            AI Assistant
          </Link>

          <p className="nav-title second-title">
            ACCOUNT
          </p>

          <Link
            to="/settings"
            className="nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Settings size={18} />
            Settings
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <div className="user-card">

            <div className="user-avatar">
              {userInitial}
            </div>

            <div>
              <strong>{userName}</strong>

              <span>
                {user.account_type ||
                  "Finance Admin"}
              </span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>

      {/* =====================================================
          MOBILE OVERLAY
          ===================================================== */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <button
            className="menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="header-title">

            <h1>
              Financial Overview
            </h1>

            <p>
              Monitor your financial health
              at a glance.
            </p>

          </div>

          <button
            className="notification-button"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span />
          </button>

        </header>

        <section
          className="dashboard-content"
          id="overview"
        >

          {/* =================================================
              WELCOME
              ================================================= */}

          <div className="welcome-section">

            <div>

              <p className="welcome-label">
                {new Date().getHours() < 12
                  ? "GOOD MORNING"
                  : new Date().getHours() < 17
                    ? "GOOD AFTERNOON"
                    : "GOOD EVENING"}
              </p>

              <h2>
                Welcome back,{" "}
                {userName} 👋
              </h2>

              <p>
                Here's a clear view of
                your business finances
                and financial health.
              </p>

            </div>

            <div className="dashboard-date">

              <span>
                REPORTING PERIOD
              </span>

              <strong>
                {new Date().toLocaleDateString(
                  "en-IN",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}
              </strong>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="dashboard-alert">

              <ShieldCheck size={16} />

              <span>{error}</span>

            </div>
          )}

          {/* =================================================
              STAT CARDS
              ================================================= */}

          <div className="stats-grid">

            {/* BALANCE */}

            <div className="stat-card">

              <div className="stat-top">

                <span>
                  Total Balance
                </span>

                <div className="stat-icon">
                  <Wallet size={18} />
                </div>

              </div>

              <h3>
                ₹
                {formatCurrency(
                  financialSummary.balance
                )}
              </h3>

              <div className="stat-change positive-change">

                <ArrowUpRight size={13} />

                Live

                <span>
                  from transactions
                </span>

              </div>

            </div>

            {/* INCOME */}

            <div className="stat-card">

              <div className="stat-top">

                <span>
                  Total Income
                </span>

                <div className="stat-icon">
                  <TrendingUp size={18} />
                </div>

              </div>

              <h3>
                ₹
                {formatCurrency(
                  financialSummary.income
                )}
              </h3>

              <div className="stat-change positive-change">

                <TrendingUp size={13} />

                Revenue

                <span>
                  recorded income
                </span>

              </div>

            </div>

            {/* EXPENSES */}

            <div className="stat-card">

              <div className="stat-top">

                <span>
                  Total Expenses
                </span>

                <div className="stat-icon expense-icon">
                  <ArrowDownRight size={18} />
                </div>

              </div>

              <h3>
                ₹
                {formatCurrency(
                  financialSummary.expenses
                )}
              </h3>

              <div className="stat-change negative-change">

                <ArrowDownRight size={13} />

                Spending

                <span>
                  recorded expenses
                </span>

              </div>

            </div>

            {/* SAVINGS */}

            <div className="stat-card">

              <div className="stat-top">

                <span>
                  Savings Rate
                </span>

                <div className="stat-icon">
                  <Target size={18} />
                </div>

              </div>

              <h3>
                {financialSummary.savingsRate.toFixed(
                  1
                )}
                %
              </h3>

              <div className="stat-change positive-change">

                <CheckCircle2 size={13} />

                Calculated

                <span>
                  from live data
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              FINANCIAL HEALTH
              ================================================= */}

          <div className="financial-health-card">

            <div className="health-copy">

              <div className="health-icon">
                <ShieldCheck size={21} />
              </div>

              <div>

                <span className="section-eyebrow">
                  FINSIGHT HEALTH SCORE
                </span>

                <div className="health-title-row">

                  <h3>
                    {financialHealth.label}
                  </h3>

                  <span className="health-pill">
                    {financialHealth.status}
                  </span>

                </div>

                <p>
                  {financialHealth.description}
                </p>

              </div>

            </div>

            <div className="health-meter">

              <div
                className="health-ring"
                style={{
                  "--health-progress":
                    healthProgress,
                }}
              >

                <div>

                  <strong>
                    {financialHealth.score}
                  </strong>

                  <span>
                    /100
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              HEALTH DETAIL STRIP
              ================================================= */}

          <div className="health-detail-grid">

            <div className="health-detail-item">

              <span>
                Savings
              </span>

              <strong>
                {healthMetrics.savingsStatus}
              </strong>

              <small>
                {financialSummary.savingsRate.toFixed(
                  1
                )}
                % savings rate
              </small>

            </div>

            <div className="health-detail-item">

              <span>
                Cash Flow
              </span>

              <strong>
                {healthMetrics.cashFlowStatus}
              </strong>

              <small>
                ₹
                {formatCurrency(
                  financialSummary.balance
                )}{" "}
                net
              </small>

            </div>

            <div className="health-detail-item">

              <span>
                Expense Control
              </span>

              <strong>
                {healthMetrics.expenseControl}
              </strong>

              <small>
                {financialSummary.expenseRatio.toFixed(
                  1
                )}
                % of income
              </small>

            </div>

            <div className="health-detail-item">

              <span>
                Transactions
              </span>

              <strong>
                {financialSummary.totalTransactions}
              </strong>

              <small>
                {financialSummary.pendingCount > 0
                  ? `${financialSummary.pendingCount} pending`
                  : "All recorded"}
              </small>

            </div>

          </div>

          {/* =================================================
              MAIN GRID
              ================================================= */}

          <div className="dashboard-grid">

            {/* =================================================
                CASH FLOW
                ================================================= */}

            <div
              className="dashboard-card chart-card"
              id="analytics"
            >

              <div className="card-header">

                <div>

                  <h3>
                    Cash Flow
                  </h3>

                  <p>
                    Income vs expenses over time
                  </p>

                </div>

                <select
                  value={chartMonths}
                  onChange={(event) =>
                    setChartMonths(
                      Number(
                        event.target.value
                      )
                    )
                  }
                >

                  <option value={6}>
                    Last 6 months
                  </option>

                  <option value={12}>
                    Last 12 months
                  </option>

                </select>

              </div>

              <div className="chart-summary-row">

                <div>

                  <span>
                    Net cash flow
                  </span>

                  <strong>
                    ₹
                    {formatCurrency(
                      financialSummary.balance
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Expense ratio
                  </span>

                  <strong>
                    {financialSummary.expenseRatio.toFixed(
                      1
                    )}
                    %
                  </strong>

                </div>

              </div>

              <div className="chart-area">

                <div className="chart-y-axis">

                  <span>
                    ₹
                    {formatCurrency(
                      maxCashFlow
                    )}
                  </span>

                  <span>
                    ₹
                    {formatCurrency(
                      maxCashFlow * 0.75
                    )}
                  </span>

                  <span>
                    ₹
                    {formatCurrency(
                      maxCashFlow * 0.5
                    )}
                  </span>

                  <span>
                    ₹
                    {formatCurrency(
                      maxCashFlow * 0.25
                    )}
                  </span>

                  <span>
                    ₹0
                  </span>

                </div>

                <div className="chart-content">

                  <div className="chart-grid-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="bar-chart">

                    {monthlyCashFlow.map(
                      (month, index) => {

                        const incomeHeight =
                          maxCashFlow > 0
                            ? (month.income /
                                maxCashFlow) *
                              100
                            : 0;

                        const expenseHeight =
                          maxCashFlow > 0
                            ? (month.expenses /
                                maxCashFlow) *
                              100
                            : 0;

                        return (
                          <div
                            className="month"
                            key={`${month.month}-${index}`}
                          >

                            <div className="bars">

                              <i
                                className="income-bar"
                                style={{
                                  height: `${Math.max(
                                    incomeHeight,
                                    month.income > 0
                                      ? 3
                                      : 0
                                  )}%`,
                                }}
                                title={`Income: ₹${formatCurrency(
                                  month.income
                                )}`}
                              />

                              <i
                                className="expense-bar"
                                style={{
                                  height: `${Math.max(
                                    expenseHeight,
                                    month.expenses > 0
                                      ? 3
                                      : 0
                                  )}%`,
                                }}
                                title={`Expenses: ₹${formatCurrency(
                                  month.expenses
                                )}`}
                              />

                            </div>

                            <span>
                              {month.month}
                            </span>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

              </div>

              <div className="chart-legend">

                <span>
                  <i className="income-dot" />
                  Income
                </span>

                <span>
                  <i className="expense-dot" />
                  Expenses
                </span>

              </div>

            </div>

            {/* =================================================
                AI INSIGHT
                ================================================= */}

            <div
              className="dashboard-card ai-card"
              id="ai-insights"
            >

              <div className="ai-heading">

                <div className="ai-icon">
                  <BrainCircuit size={21} />
                </div>

                <div className="ai-heading-text">

                  <h3>
                    AI Financial Insight
                  </h3>

                  <p>
                    Personalized from your
                    recorded transactions
                  </p>

                </div>

                <span className="ai-live-badge">

                  <span className="ai-live-dot" />

                  LIVE

                </span>

              </div>

              <div className="ai-message">

                <div className="ai-insight-icon">
                  <Sparkles size={18} />
                </div>

                <div>

                  <h4>
                    {aiAnalysis?.title ||
                      (financialSummary.balance >= 0
                        ? "Your cash flow is currently positive."
                        : "Your expenses need attention.")}
                  </h4>

                  <p>

                    {typeof aiAnalysis?.message ===
                    "string"
                      ? aiAnalysis.message
                      : transactions.length === 0
                        ? "Add transactions to unlock personalized financial intelligence."
                        : `FinSight is monitoring ${transactions.length} recorded transaction${
                            transactions.length === 1
                              ? ""
                              : "s"
                          } in your account.`}

                  </p>

                </div>

              </div>

              <div className="ai-mini-grid">

                <div>

                  <span>
                    Health
                  </span>

                  <strong>
                    {financialHealth.score}/100
                  </strong>

                </div>

                <div>

                  <span>
                    Top category
                  </span>

                  <strong>
                    {topExpense?.category || "—"}
                  </strong>

                </div>

              </div>

              <div className="ai-recommendation">

                <div className="recommendation-title">

                  <Target size={15} />

                  <span>
                    Recommendation
                  </span>

                </div>

                <p>

                  {aiAnalysis?.recommendation ||
                    (financialSummary.income >
                    financialSummary.expenses
                      ? "Your recorded income is above expenses. Consider directing part of the surplus toward reserves or future growth."
                      : financialSummary.income ===
                          financialSummary.expenses
                        ? "Income and expenses are currently equal. Monitor upcoming transactions closely."
                        : "Review high-spend categories and identify expenses that can be reduced.")}

                </p>

              </div>

              <button
                className="ai-button"
                onClick={handleAIAnalysis}
                disabled={loadingAI}
              >

                <BrainCircuit size={17} />

                {loadingAI
                  ? "Generating Analysis..."
                  : "View Full AI Analysis"}

              </button>

              {aiError && (
                <div className="ai-analysis-error">

                  <strong>
                    AI Analysis Error
                  </strong>

                  <p>
                    {aiError}
                  </p>

                </div>
              )}

              {aiAnalysis && (
                <div className="ai-analysis-result">

                  <div className="ai-analysis-header">

                    <div>

                      <span className="ai-analysis-label">
                        FINANCIAL ANALYSIS
                      </span>

                      <h4>
                        {aiAnalysis.title ||
                          "Your Financial Overview"}
                      </h4>

                    </div>

                    <div className="ai-analysis-status">

                      <BrainCircuit size={15} />

                      AI Generated

                    </div>

                  </div>

                  {(aiAnalysis.aiAnalysis ||
                    aiAnalysis.message) && (
                    <div className="ai-analysis-intro">

                      {typeof (
                        aiAnalysis.aiAnalysis ||
                        aiAnalysis.message
                      ) === "object" ? (
                        <>

                          {(
                            aiAnalysis.aiAnalysis ||
                            aiAnalysis.message
                          ).summary && (
                            <p>
                              {
                                (
                                  aiAnalysis.aiAnalysis ||
                                  aiAnalysis.message
                                ).summary
                              }
                            </p>
                          )}

                          {(
                            aiAnalysis.aiAnalysis ||
                            aiAnalysis.message
                          ).risk && (
                            <p>

                              <strong>
                                Risk:
                              </strong>{" "}

                              {
                                (
                                  aiAnalysis.aiAnalysis ||
                                  aiAnalysis.message
                                ).risk
                              }

                            </p>
                          )}

                          {(
                            aiAnalysis.aiAnalysis ||
                            aiAnalysis.message
                          ).action && (
                            <p>

                              <strong>
                                Action:
                              </strong>{" "}

                              {
                                (
                                  aiAnalysis.aiAnalysis ||
                                  aiAnalysis.message
                                ).action
                              }

                            </p>
                          )}

                        </>
                      ) : (
                        <p>
                          {aiAnalysis.aiAnalysis ||
                            aiAnalysis.message}
                        </p>
                      )}

                    </div>
                  )}

                  <div className="ai-analysis-stats">

                    <div className="ai-analysis-stat">

                      <span>
                        Transactions
                      </span>

                      <strong>
                        {aiAnalysis.transactionCount ??
                          transactions.length}
                      </strong>

                    </div>

                    <div className="ai-analysis-stat">

                      <span>
                        Income
                      </span>

                      <strong>
                        ₹
                        {formatCurrency(
                          aiAnalysis.income ??
                            financialSummary.income
                        )}
                      </strong>

                    </div>

                    <div className="ai-analysis-stat">

                      <span>
                        Expenses
                      </span>

                      <strong>
                        ₹
                        {formatCurrency(
                          aiAnalysis.expenses ??
                            financialSummary.expenses
                        )}
                      </strong>

                    </div>

                    <div className="ai-analysis-stat">

                      <span>
                        Balance
                      </span>

                      <strong>
                        ₹
                        {formatCurrency(
                          aiAnalysis.balance ??
                            financialSummary.balance
                        )}
                      </strong>

                    </div>

                  </div>

                  <div className="ai-analysis-details">

                    <div className="ai-detail-item">

                      <span>
                        Savings Rate
                      </span>

                      <strong>
                        {Number(
                          aiAnalysis.savingsRate ??
                            financialSummary.savingsRate
                        ).toFixed(1)}
                        %
                      </strong>

                    </div>

                    {aiAnalysis.highestExpenseCategory && (
                      <div className="ai-detail-item">

                        <span>
                          Highest Expense
                        </span>

                        <strong>
                          {
                            aiAnalysis.highestExpenseCategory
                          }

                          {" • "}₹

                          {formatCurrency(
                            aiAnalysis.highestExpenseAmount
                          )}

                        </strong>

                      </div>
                    )}

                  </div>

                  {aiAnalysis.recommendation && (
                    <div className="ai-analysis-recommendation">

                      <div className="recommendation-title">

                        <BrainCircuit size={15} />

                        <span>
                          AI Recommendation
                        </span>

                      </div>

                      <p>
                        {aiAnalysis.recommendation}
                      </p>

                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              LOWER GRID
              ================================================= */}

          <div className="lower-grid">

            {/* SPENDING */}

            <div className="dashboard-card spending-card">

              <div className="card-header">

                <div>

                  <h3>
                    Spending Overview
                  </h3>

                  <p>
                    Where your recorded
                    expenses are going
                  </p>

                </div>

                <Link
                  to="/analytics"
                  className="card-link"
                >

                  View analytics

                  <ChevronRight size={13} />

                </Link>

              </div>

              {topExpense ? (
                <>

                  <div className="top-spend">

                    <div className="top-spend-icon">

                      <CircleDollarSign
                        size={19}
                      />

                    </div>

                    <div>

                      <span>
                        Top expense category
                      </span>

                      <strong>
                        {topExpense.category}
                      </strong>

                    </div>

                    <div className="top-spend-amount">

                      ₹
                      {formatCurrency(
                        topExpense.amount
                      )}

                    </div>

                  </div>

                  <div className="expense-breakdown">

                    {expenseBreakdown
                      .slice(0, 4)
                      .map((item) => {

                        const percentage =
                          financialSummary.expenses >
                          0
                            ? (item.amount /
                                financialSummary.expenses) *
                              100
                            : 0;

                        return (
                          <div
                            className="expense-row"
                            key={item.category}
                          >

                            <div className="expense-row-head">

                              <span>
                                {item.category}
                              </span>

                              <strong>
                                {percentage.toFixed(1)}%
                              </strong>

                            </div>

                            <div className="expense-track">

                              <div
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />

                            </div>

                            <small>
                              ₹
                              {formatCurrency(
                                item.amount
                              )}
                            </small>

                          </div>
                        );
                      })}

                  </div>

                </>
              ) : (
                <div className="empty-state">

                  <CircleDollarSign size={20} />

                  <p>
                    No expense categories
                    available yet.
                  </p>

                </div>
              )}

            </div>

            {/* RECENT ACTIVITY */}

            <div className="dashboard-card recent-card">

              <div className="card-header">

                <div>

                  <h3>
                    Recent Activity
                  </h3>

                  <p>
                    Your latest recorded
                    transactions
                  </p>

                </div>

                <Link
                  to="/transactions"
                  className="card-link"
                >

                  View all

                  <ChevronRight size={13} />

                </Link>

              </div>

              <div className="recent-list">

                {loadingTransactions ? (
                  <div className="empty-state">

                    <p>
                      Loading transactions...
                    </p>

                  </div>
                ) : recentTransactions.length ===
                  0 ? (
                  <div className="empty-state">

                    <Receipt size={20} />

                    <p>
                      No transactions
                      recorded yet.
                    </p>

                  </div>
                ) : (
                  recentTransactions.map(
                    (transaction) => {

                      const isIncome =
                        transaction.type ===
                        "income";

                      const isPending =
                        transaction.status ===
                        "pending";

                      return (
                        <div
                          className="recent-transaction"
                          key={transaction.id}
                        >

                          <div
                            className={
                              "recent-icon " +
                              (isIncome
                                ? "income-transaction"
                                : "expense-transaction")
                            }
                          >

                            {isIncome ? (
                              <ArrowUpRight size={15} />
                            ) : (
                              <ArrowDownRight size={15} />
                            )}

                          </div>

                          <div className="recent-info">

                            <strong>
                              {transaction.description}
                            </strong>

                            <span>

                              {transaction.category ||
                                "General"}

                              {" • "}

                              {formatDate(
                                transaction.transaction_date
                              )}

                              {isPending && (
                                <>
                                  {" • "}
                                  Pending
                                </>
                              )}

                            </span>

                          </div>

                          <div
                            className={
                              "recent-amount " +
                              (isIncome
                                ? "income-amount"
                                : "expense-amount")
                            }
                          >

                            {isIncome
                              ? "+"
                              : "-"}

                            ₹
                            {formatCurrency(
                              transaction.amount
                            )}

                          </div>

                        </div>
                      );
                    }
                  )
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              QUICK ACTIONS
              ================================================= */}

          <div className="dashboard-quick-actions">

            <Link
              to="/transactions"
              className="quick-action"
            >

              <Receipt size={18} />

              <div>

                <strong>
                  Manage Transactions
                </strong>

                <span>
                  Add, update and review
                  financial records
                </span>

              </div>

              <ChevronRight size={16} />

            </Link>

            <Link
              to="/analytics"
              className="quick-action"
            >

              <BarChart3 size={18} />

              <div>

                <strong>
                  Open Analytics
                </strong>

                <span>
                  Explore detailed financial
                  performance
                </span>

              </div>

              <ChevronRight size={16} />

            </Link>

            <Link
              to="/ai-assistant"
              className="quick-action"
            >

              <Sparkles size={18} />

              <div>

                <strong>
                  Ask FinSight AI
                </strong>

                <span>
                  Get answers about your
                  finances
                </span>

              </div>

              <ChevronRight size={16} />

            </Link>

          </div>

          {/* =================================================
              FOOTER
              ================================================= */}

          <div className="dashboard-footer-note">

            <ShieldCheck size={14} />

            <span>
              FinSight Health Score is an
              application-level indicator
              calculated from recorded
              financial activity. It is not
              regulated financial advice.
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;