import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ShieldCheck,
  Zap,
} from "lucide-react";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          FinSight<span>AI</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <BrainCircuit size={16} />
            AI-Powered Financial Intelligence
          </div>

          <h1>
            Take Control of Your
            <span> Finances with AI</span>
          </h1>

          <p>
            FinSight AI helps businesses understand their money, reconcile
            transactions, detect financial anomalies, and make smarter
            financial decisions.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Get Started
              <ArrowRight size={18} />
            </Link>

            <Link to="/login" className="secondary-button">
              Explore Dashboard
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="dashboard-preview">
          <div className="preview-header">
            <div>
              <p>Total Balance</p>
              <h2>₹12,84,500</h2>
            </div>

            <div className="positive">+12.8%</div>
          </div>

          <div className="chart">
            <div className="chart-line"></div>
          </div>

          <div className="preview-stats">
            <div>
              <span>Income</span>
              <strong>₹18.4L</strong>
            </div>

            <div>
              <span>Expenses</span>
              <strong>₹5.6L</strong>
            </div>

            <div>
              <span>Savings</span>
              <strong>₹12.8L</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="section-heading">
          <p className="section-label">POWERFUL FEATURES</p>
          <h2>Everything you need to understand your finances</h2>
          <p>
            From automated reconciliation to intelligent insights, FinSight
            AI brings your financial operations into one place.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <BrainCircuit />
            </div>
            <h3>AI Financial Insights</h3>
            <p>
              Get intelligent recommendations and understand the story behind
              your financial data.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 />
            </div>
            <h3>Smart Analytics</h3>
            <p>
              Visualize revenue, expenses, cash flow, and financial trends
              through intuitive dashboards.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck />
            </div>
            <h3>Secure & Reliable</h3>
            <p>
              Protect financial information with authentication, authorization,
              and secure backend architecture.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Zap />
            </div>
            <h3>Automated Reconciliation</h3>
            <p>
              Match transactions and identify inconsistencies without manually
              checking every financial record.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <p className="section-label">HOW IT WORKS</p>
          <h2>Your financial controller, powered by intelligence</h2>
        </div>

        <div className="steps">
          <div className="step">
            <span>01</span>
            <h3>Connect Your Data</h3>
            <p>
              Bring your transaction and financial data into FinSight AI.
            </p>
          </div>

          <div className="step">
            <span>02</span>
            <h3>Analyze Automatically</h3>
            <p>
              FinSight processes your data and identifies patterns,
              inconsistencies, and trends.
            </p>
          </div>

          <div className="step">
            <span>03</span>
            <h3>Make Better Decisions</h3>
            <p>
              Use AI-powered insights to make faster and smarter financial
              decisions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to take control of your finances?</h2>
        <p>
          Start using FinSight AI and turn your financial data into actionable
          intelligence.
        </p>

        <Link to="/register" className="primary-button">
          Start Building Your Financial Future
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="logo">
          FinSight<span>AI</span>
        </div>

        <p>AI-Powered Financial Controller</p>

        <p>© 2026 FinSight AI. Built for smarter financial decisions.</p>
      </footer>
    </div>
  );
}

export default Landing;