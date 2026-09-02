import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeft,
  Plus,
  Search,
  X,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Transactions.css";

const API_URL = "http://127.0.0.1:5100";
function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    type: "income",
    description: "",
    category: "Revenue",
    amount: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load transactions.");
      }

      setTransactions(
        Array.isArray(data.transactions) ? data.transactions : []
      );
    } catch (err) {
      console.error("Fetch transactions error:", err);
      setError(err.message || "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (
      !form.description.trim() ||
      !form.category ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError("Please enter a description and a valid amount.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: form.type,
          description: form.description.trim(),
          category: form.category,
          amount,
          transaction_date: form.transaction_date,
          status: "completed",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add transaction.");
      }

      setForm({
        type: "income",
        description: "",
        category: "Revenue",
        amount: "",
        transaction_date: new Date().toISOString().split("T")[0],
      });

      setShowForm(false);

      await fetchTransactions();
    } catch (err) {
      console.error("Add transaction error:", err);
      setError(err.message || "Unable to add transaction.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (transactionId) => {
    const transaction = transactions.find(
      (item) => item.id === transactionId
    );

    if (!transaction) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${transaction.description}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    setDeletingId(transactionId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/transactions/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete transaction."
        );
      }

      setTransactions((previous) =>
        previous.filter(
          (item) => item.id !== transactionId
        )
      );
    } catch (err) {
      console.error("Delete transaction error:", err);
      setError(err.message || "Unable to delete transaction.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    const expenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    return {
      income,
      expenses,
      balance: income - expenses,
      count: transactions.length,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      return (
        String(transaction.description || "")
          .toLowerCase()
          .includes(search) ||
        String(transaction.category || "")
          .toLowerCase()
          .includes(search) ||
        String(transaction.type || "")
          .toLowerCase()
          .includes(search) ||
        String(transaction.status || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [transactions, searchTerm]);

  return (
    <div className="transactions-page">
      <header className="transactions-header">
        <div className="transactions-header-left">
          <Link to="/dashboard" className="back-button">
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1>Transactions</h1>
            <p>Manage and review your financial activity.</p>
          </div>
        </div>

        <button
          className="add-transaction-button"
          onClick={() => {
            setError("");
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </header>

      {error && (
        <div className="transaction-error">
          {error}

          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <section className="transaction-summary">
        <div className="summary-card">
          <span>Total Transactions</span>
          <strong>{summary.count}</strong>
        </div>

        <div className="summary-card">
          <span>Total Income</span>
          <strong>₹{formatCurrency(summary.income)}</strong>
        </div>

        <div className="summary-card">
          <span>Total Expenses</span>
          <strong>₹{formatCurrency(summary.expenses)}</strong>
        </div>

        <div className="summary-card">
          <span>Net Balance</span>
          <strong>
            {summary.balance >= 0 ? "+" : "-"}₹
            {formatCurrency(Math.abs(summary.balance))}
          </strong>
        </div>
      </section>

      <section className="transactions-table-card">
        <div className="table-header">
          <div>
            <h2>All Transactions</h2>
            <p>Your transactions from the database.</p>
          </div>

          <div className="search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="empty-transactions">
            <strong>Loading transactions...</strong>
            <span>
              Please wait while we fetch your data.
            </span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-transactions">
            <strong>No transactions yet</strong>

            <span>
              Click "Add Transaction" to create your first
              transaction.
            </span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-transactions">
            <strong>No matching transactions</strong>

            <span>
              Try searching for another description,
              category, or type.
            </span>
          </div>
        ) : (
          <div className="transaction-table-wrapper">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => {
                  const isIncome =
                    transaction.type === "income";

                  const isDeleting =
                    deletingId === transaction.id;

                  return (
                    <tr key={transaction.id}>
                      <td>
                        <div className="table-transaction">
                          <div
                            className={
                              isIncome
                                ? "table-icon income-icon"
                                : "table-icon expense-icon"
                            }
                          >
                            {isIncome ? (
                              <ArrowDownRight size={17} />
                            ) : (
                              <ArrowUpRight size={17} />
                            )}
                          </div>

                          <strong>
                            {transaction.description}
                          </strong>
                        </div>
                      </td>

                      <td>
                        {isIncome ? "Income" : "Expense"}
                      </td>

                      <td>{transaction.category}</td>

                      <td>
                        {formatDate(
                          transaction.transaction_date
                        )}
                      </td>

                      <td
                        className={
                          isIncome
                            ? "table-income"
                            : "table-expense"
                        }
                      >
                        {isIncome ? "+" : "-"}₹
                        {formatCurrency(transaction.amount)}
                      </td>

                      <td>
                        <span
                          className={
                            transaction.status ===
                            "completed"
                              ? "table-status completed"
                              : "table-status pending"
                          }
                        >
                          {transaction.status || "pending"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="delete-transaction-button"
                          onClick={() =>
                            handleDelete(transaction.id)
                          }
                          disabled={isDeleting}
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />

                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div
          className="transaction-modal-overlay"
          onClick={() => {
            if (!saving) {
              setShowForm(false);
            }
          }}
        >
          <div
            className="transaction-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>Add Transaction</h2>
                <p>
                  Save a new transaction to PostgreSQL.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Transaction Type

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="income">
                    Income
                  </option>
                  <option value="expense">
                    Expense
                  </option>
                </select>
              </label>

              <label>
                Description

                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="e.g. Client Payment"
                />
              </label>

              <label>
                Category

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Revenue">
                    Revenue
                  </option>
                  <option value="Salary">
                    Salary
                  </option>
                  <option value="Operations">
                    Operations
                  </option>
                  <option value="Marketing">
                    Marketing
                  </option>
                  <option value="Software">
                    Software
                  </option>
                  <option value="Rent">
                    Rent
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </label>

              <label>
                Amount

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="50000"
                  min="1"
                  step="0.01"
                />
              </label>

              <label>
                Transaction Date

                <input
                  type="date"
                  name="transaction_date"
                  value={form.transaction_date}
                  onChange={handleChange}
                />
              </label>

              <button
                className="save-transaction-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;