import { useEffect, useState } from "react";
import "./Reconciliation.css";

const API_URL = "http://127.0.0.1:5100";
function Reconciliation() {
  const [reconciliation, setReconciliation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReconciliation = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reconciliation`,
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
          data.message || "Failed to load reconciliation."
        );
      }

      setReconciliation(data.reconciliation);
    } catch (err) {
      console.error("Reconciliation error:", err);

      setError(
        err.message || "Unable to load reconciliation."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReconciliation();
  }, []);

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  /*
   * ==========================================
   * MARK TRANSACTION AS COMPLETED
   * ==========================================
   */
  const handleMarkAsMatched = async (transactionId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    setUpdatingId(transactionId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/transactions/${transactionId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update transaction status."
        );
      }

      /*
       * Refresh reconciliation data from PostgreSQL
       * so summary + transaction status stay synchronized.
       */
      await fetchReconciliation();
    } catch (err) {
      console.error(
        "Mark transaction as matched error:",
        err
      );

      setError(
        err.message ||
          "Unable to update transaction status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="reconciliation-page">
        <div className="reconciliation-loading">
          Loading reconciliation data...
        </div>
      </div>
    );
  }

  if (error && !reconciliation) {
    return (
      <div className="reconciliation-page">
        <div className="reconciliation-error">
          {error}
        </div>
      </div>
    );
  }

  if (!reconciliation) {
    return (
      <div className="reconciliation-page">
        <div className="reconciliation-empty">
          No reconciliation data available.
        </div>
      </div>
    );
  }

  const {
    summary,
    transactions,
  } = reconciliation;

  return (
    <div className="reconciliation-page">
      {/* ==========================================
          HEADER
          ========================================== */}

      <header className="reconciliation-header">
        <div>
          <p className="reconciliation-label">
            FINANCIAL CONTROL
          </p>

          <h1>Reconciliation</h1>

          <p>
            Review and verify your financial transactions.
          </p>
        </div>
      </header>

      {/* ==========================================
          ERROR
          ========================================== */}

      {error && (
        <div className="reconciliation-error">
          {error}
        </div>
      )}

      {/* ==========================================
          SUMMARY
          ========================================== */}

      <section className="reconciliation-stats">
        <div className="reconciliation-stat-card">
          <span>Total Transactions</span>

          <h2>
            {summary.totalTransactions}
          </h2>
        </div>

        <div className="reconciliation-stat-card">
          <span>Matched</span>

          <h2>
            {summary.matchedTransactions}
          </h2>
        </div>

        <div className="reconciliation-stat-card">
          <span>Pending</span>

          <h2>
            {summary.pendingTransactions}
          </h2>
        </div>

        <div className="reconciliation-stat-card">
          <span>Total Amount</span>

          <h2>
            ₹{formatCurrency(summary.totalAmount)}
          </h2>
        </div>
      </section>

      {/* ==========================================
          TRANSACTION TABLE
          ========================================== */}

      <section className="reconciliation-card">
        <div className="reconciliation-card-header">
          <div>
            <h2>
              Transaction Reconciliation
            </h2>

            <p>
              Transactions retrieved from your database.
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="reconciliation-empty">
            No transactions available.
          </div>
        ) : (
          <div className="reconciliation-table-wrapper">
            <table className="reconciliation-table">
              <thead>
                <tr>
                  <th>Description</th>

                  <th>Category</th>

                  <th>Type</th>

                  <th>Amount</th>

                  <th>Date</th>

                  <th>Status</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const isPending =
                    transaction.status === "pending";

                  const isUpdating =
                    updatingId === transaction.id;

                  return (
                    <tr key={transaction.id}>
                      <td>
                        {transaction.description}
                      </td>

                      <td>
                        {transaction.category}
                      </td>

                      <td>
                        {transaction.type}
                      </td>

                      <td>
                        ₹
                        {formatCurrency(
                          transaction.amount
                        )}
                      </td>

                      <td>
                        {new Date(
                          transaction.transaction_date
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            transaction.status ===
                            "completed"
                              ? "reconciliation-status completed"
                              : "reconciliation-status pending"
                          }
                        >
                          {transaction.status}
                        </span>
                      </td>

                      <td>
                        {isPending ? (
                          <button
                            type="button"
                            className="reconciliation-match-button"
                            onClick={() =>
                              handleMarkAsMatched(
                                transaction.id
                              )
                            }
                            disabled={isUpdating}
                          >
                            {isUpdating
                              ? "Updating..."
                              : "Mark as Matched"}
                          </button>
                        ) : (
                          <span className="reconciliation-matched-text">
                            Matched
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Reconciliation;