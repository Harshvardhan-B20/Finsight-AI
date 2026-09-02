import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  TrendingUp,
  Wallet,
} from "lucide-react";
import "./Analytics.css";

const API_URL = "http://127.0.0.1:5100";
function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          API_URL + "/api/analytics",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load analytics."
          );
        }

        setAnalytics(data.analytics);
      } catch (err) {
        console.error("Analytics error:", err);
        setError(
          err.message || "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          Loading your financial analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-error">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-page">
        <div className="analytics-empty">
          No analytics data available.
        </div>
      </div>
    );
  }

  const {
    summary,
    monthlyCashFlow,
    categoryExpenses,
  } = analytics;

  const maxCashFlow = Math.max(
    ...monthlyCashFlow.flatMap((month) => [
      Number(month.income || 0),
      Number(month.expenses || 0),
    ]),
    1
  );

  const totalCategoryExpenses = categoryExpenses.reduce(
    (total, category) =>
      total + Number(category.total || 0),
    0
  );

  return (
    <div className="analytics-page">
      {/* HEADER */}
      <header className="analytics-header">
        <div>
          <p className="analytics-label">
            FINANCIAL INTELLIGENCE
          </p>

          <h1>Analytics</h1>

          <p>
            Analyze your financial performance and
            spending patterns.
          </p>
        </div>

        <div className="analytics-period">
  {new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  })}
</div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="analytics-stats">
        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Total Income</span>

            <div className="analytics-icon">
              <TrendingUp size={19} />
            </div>
          </div>

          <h2>
            ₹{formatCurrency(summary.income)}
          </h2>

          <p className="analytics-positive">
            <ArrowUpRight size={15} />
            Money received
          </p>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Total Expenses</span>

            <div className="analytics-icon expense">
              <ArrowDownRight size={19} />
            </div>
          </div>

          <h2>
            ₹{formatCurrency(summary.expenses)}
          </h2>

          <p className="analytics-negative">
            <ArrowDownRight size={15} />
            Money spent
          </p>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Balance</span>

            <div className="analytics-icon">
              <Wallet size={19} />
            </div>
          </div>

          <h2>
            ₹{formatCurrency(summary.balance)}
          </h2>

          <p className="analytics-positive">
            <TrendingUp size={15} />
            Current balance
          </p>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Savings Rate</span>

            <div className="analytics-icon">
              <BarChart3 size={19} />
            </div>
          </div>

          <h2>
            {Number(summary.savingsRate || 0).toFixed(1)}%
          </h2>

          <p className="analytics-positive">
            <TrendingUp size={15} />
            Income retained
          </p>
        </div>
      </section>

      {/* MAIN ANALYTICS GRID */}
      <section className="analytics-grid">
        {/* CASH FLOW */}
        <div className="analytics-card cash-flow-card">
          <div className="analytics-card-header">
            <div>
              <h2>Monthly Cash Flow</h2>
              <p>
                Income vs expenses over time.
              </p>
            </div>

            <div className="cash-flow-legend">
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

          {monthlyCashFlow.length === 0 ? (
            <div className="analytics-empty">
              No monthly cash flow data available.
            </div>
          ) : (
            <div className="cash-flow-chart">
              {monthlyCashFlow.map((month) => {
                const incomeHeight =
                  (Number(month.income || 0) /
                    maxCashFlow) *
                  100;

                const expenseHeight =
                  (Number(month.expenses || 0) /
                    maxCashFlow) *
                  100;

                return (
                  <div
                    className="cash-flow-month"
                    key={month.month}
                  >
                    <div className="cash-flow-bars">
                      <div
                        className="cash-bar income-bar"
                        style={{
                          height:
                            `${Math.max(
                              incomeHeight,
                              3
                            )}%`,
                        }}
                        title={`Income: ₹${formatCurrency(
                          month.income
                        )}`}
                      />

                      <div
                        className="cash-bar expense-bar"
                        style={{
                          height:
                            `${Math.max(
                              expenseHeight,
                              3
                            )}%`,
                        }}
                        title={`Expenses: ₹${formatCurrency(
                          month.expenses
                        )}`}
                      />
                    </div>

                    <span>{month.month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CATEGORY EXPENSES */}
        <div className="analytics-card category-card">
          <div className="analytics-card-header">
            <div>
              <h2>Spending by Category</h2>
              <p>
                Where your money is going.
              </p>
            </div>
          </div>

          {categoryExpenses.length === 0 ? (
            <div className="analytics-empty">
              No expense data available.
            </div>
          ) : (
            <div className="category-list">
              {categoryExpenses.map((category) => {
                const percentage =
                  totalCategoryExpenses > 0
                    ? (Number(category.total) /
                        totalCategoryExpenses) *
                      100
                    : 0;

                return (
                  <div
                    className="category-item"
                    key={category.category}
                  >
                    <div className="category-info">
                      <strong>
                        {category.category}
                      </strong>

                      <span>
                        ₹{formatCurrency(category.total)}
                      </span>
                    </div>

                    <div className="category-progress">
                      <div
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />
                    </div>

                    <small>
                      {percentage.toFixed(1)}%
                    </small>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FINANCIAL SUMMARY */}
      <section className="analytics-card financial-summary-card">
        <div className="analytics-card-header">
          <div>
            <h2>Financial Summary</h2>
            <p>
              A quick overview of your current
              financial position.
            </p>
          </div>
        </div>

        <div className="summary-details">
          <div>
            <span>Total Transactions</span>
            <strong>
              {summary.totalTransactions}
            </strong>
          </div>

          <div>
            <span>Income</span>
            <strong>
              ₹{formatCurrency(summary.income)}
            </strong>
          </div>

          <div>
            <span>Expenses</span>
            <strong>
              ₹{formatCurrency(summary.expenses)}
            </strong>
          </div>

          <div>
            <span>Net Balance</span>
            <strong>
              ₹{formatCurrency(summary.balance)}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Analytics;