import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
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
            FinSight AI helps businesses understand their money, analyze
            transactions, monitor cash flow, reconcile financial records, and
            make smarter financial decisions.
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

          <div className="hero-trust">
            <div>
              <CheckCircle2 size={15} />
              Real-time financial data
            </div>

            <div>
              <CheckCircle2 size={15} />
              AI-powered analysis
            </div>

            <div>
              <CheckCircle2 size={15} />
              Secure authentication
            </div>
          </div>
        </div>

        {/* AI Product Preview */}
        <div className="hero-product">
          <div className="product-window">
            <div className="window-top">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>

              <div className="window-title">
                <BrainCircuit size={14} />
                FinSight AI
              </div>

              <div className="window-status">
                <span />
                Live
              </div>
            </div>

            <div className="product-body">
              <div className="product-sidebar">
                <div className="mini-logo">
                  <Wallet size={17} />
                </div>

                <div className="mini-nav active">
                  <BarChart3 size={16} />
                </div>

                <div className="mini-nav">
                  <TrendingUp size={16} />
                </div>

                <div className="mini-nav">
                  <RefreshCw size={16} />
                </div>

                <div className="mini-nav">
                  <MessageSquareText size={16} />
                </div>
              </div>

              <div className="product-main">
                <div className="product-heading">
                  <div>
                    <span>FINANCIAL OVERVIEW</span>
                    <h3>Understand your business</h3>
                  </div>

                  <div className="mini-pill">
                    <Sparkles size={13} />
                    AI Ready
                  </div>
                </div>

                <div className="mini-metrics">
                  <div className="mini-metric">
                    <span>Total Balance</span>
                    <strong>Live Data</strong>
                    <small>
                      <TrendingUp size={12} />
                      Updated from transactions
                    </small>
                  </div>

                  <div className="mini-metric">
                    <span>Cash Flow</span>
                    <strong>Analyzing</strong>
                    <small>
                      <BarChart3 size={12} />
                      Monthly trends
                    </small>
                  </div>
                </div>

                <div className="mini-chart">
                  <div className="chart-header">
                    <span>Cash Flow Overview</span>
                    <span className="chart-period">Monthly</span>
                  </div>

                  <div className="chart-area">
                    <div className="chart-grid">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <svg
                      className="chart-svg"
                      viewBox="0 0 500 150"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 120 C45 105 60 112 95 88 S145 96 175 70 S225 85 255 58 S305 70 335 42 S390 62 420 30 S465 42 500 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="ai-preview">
                  <div className="ai-preview-icon">
                    <BrainCircuit size={18} />
                  </div>

                  <div className="ai-preview-content">
                    <div className="ai-preview-title">
                      <strong>AI Financial Insight</strong>
                      <span>Generated from your data</span>
                    </div>

                    <p>
                      FinSight analyzes your transaction patterns to identify
                      important trends, spending behavior, and opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="floating-card floating-card-one">
            <Sparkles size={16} />
            <div>
              <strong>AI Analysis</strong>
              <span>Ready to help</span>
            </div>
          </div>

          <div className="floating-card floating-card-two">
            <ShieldCheck size={16} />
            <div>
              <strong>Protected</strong>
              <span>Authenticated data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Capability Strip */}
      <section className="capability-strip">
        <div className="capability-item">
          <BrainCircuit size={18} />
          <span>AI Financial Intelligence</span>
        </div>

        <div className="capability-item">
          <BarChart3 size={18} />
          <span>Smart Analytics</span>
        </div>

        <div className="capability-item">
          <RefreshCw size={18} />
          <span>Automated Reconciliation</span>
        </div>

        <div className="capability-item">
          <ShieldCheck size={18} />
          <span>Secure Architecture</span>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="section-heading">
          <p className="section-label">POWERFUL FEATURES</p>

          <h2>
            Everything you need to
            <span> understand your finances</span>
          </h2>

          <p>
            From transaction management to AI-powered financial intelligence,
            FinSight AI brings essential financial operations into one
            connected platform.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card feature-card-large">
            <div className="feature-icon">
              <BrainCircuit />
            </div>

            <div className="feature-number">01</div>

            <h3>AI Financial Insights</h3>

            <p>
              Turn raw financial data into understandable insights,
              recommendations, and explanations powered by AI.
            </p>

            <div className="feature-link">
              Intelligent analysis <ArrowRight size={15} />
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 />
            </div>

            <div className="feature-number">02</div>

            <h3>Smart Analytics</h3>

            <p>
              Visualize revenue, expenses, cash flow, categories, and financial
              trends through intuitive analytics.
            </p>

            <div className="feature-link">
              Understand trends <ArrowRight size={15} />
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <RefreshCw />
            </div>

            <div className="feature-number">03</div>

            <h3>Automated Reconciliation</h3>

            <p>
              Simplify financial reconciliation and identify inconsistencies
              without manually checking every record.
            </p>

            <div className="feature-link">
              Reduce manual work <ArrowRight size={15} />
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck />
            </div>

            <div className="feature-number">04</div>

            <h3>Secure & Reliable</h3>

            <p>
              Protect financial information with authentication, protected
              APIs, and a structured backend architecture.
            </p>

            <div className="feature-link">
              Built with security <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </section>

      {/* AI Showcase */}
      <section className="ai-showcase">
        <div className="ai-showcase-copy">
          <div className="showcase-badge">
            <Sparkles size={15} />
            INTELLIGENT FINANCIAL ASSISTANCE
          </div>

          <h2>
            Ask your finances
            <span> anything.</span>
          </h2>

          <p>
            Instead of searching through reports manually, ask questions in
            natural language and let FinSight AI analyze your financial data.
          </p>

          <div className="showcase-list">
            <div>
              <CheckCircle2 size={17} />
              <span>Understand your financial position</span>
            </div>

            <div>
              <CheckCircle2 size={17} />
              <span>Analyze spending patterns</span>
            </div>

            <div>
              <CheckCircle2 size={17} />
              <span>Identify major expense areas</span>
            </div>

            <div>
              <CheckCircle2 size={17} />
              <span>Get data-driven recommendations</span>
            </div>
          </div>

          <Link to="/login" className="text-button">
            Explore AI Assistant
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="chat-preview">
          <div className="chat-header">
            <div className="chat-avatar">
              <BrainCircuit size={19} />
            </div>

            <div>
              <strong>FinSight AI</strong>
              <span>Financial Assistant</span>
            </div>

            <div className="chat-online">
              <span />
              Online
            </div>
          </div>

          <div className="chat-messages">
            <div className="chat-message user-message">
              <span>Where am I spending the most?</span>
            </div>

            <div className="chat-message ai-message">
              <div className="ai-message-icon">
                <Sparkles size={14} />
              </div>

              <div>
                <strong>Financial analysis</strong>
                <p>
                  I can analyze your transaction history, identify your largest
                  expense categories, and explain the spending patterns behind
                  them.
                </p>
              </div>
            </div>

            <div className="chat-message user-message">
              <span>Analyze my spending.</span>
            </div>

            <div className="chat-message ai-message compact">
              <div className="ai-message-icon">
                <BrainCircuit size={14} />
              </div>

              <div>
                <strong>Analyzing your data...</strong>
                <div className="analysis-bars">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>

          <div className="chat-input">
            <span>Ask about your finances...</span>
            <div>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* Product Capabilities */}
      <section className="capabilities-section">
        <div className="section-heading centered">
          <p className="section-label">ONE CONNECTED PLATFORM</p>

          <h2>
            From raw transactions to
            <span> financial intelligence</span>
          </h2>

          <p>
            FinSight AI connects your financial data, analytics, reconciliation,
            and AI assistance into one workflow.
          </p>
        </div>

        <div className="capability-flow">
          <div className="flow-card">
            <div className="flow-icon">
              <Wallet />
            </div>

            <span>01</span>
            <h3>Transactions</h3>
            <p>Record and manage your financial activity.</p>
          </div>

          <div className="flow-arrow">
            <ArrowRight />
          </div>

          <div className="flow-card">
            <div className="flow-icon">
              <BarChart3 />
            </div>

            <span>02</span>
            <h3>Analytics</h3>
            <p>Turn transaction data into meaningful trends.</p>
          </div>

          <div className="flow-arrow">
            <ArrowRight />
          </div>

          <div className="flow-card">
            <div className="flow-icon">
              <BrainCircuit />
            </div>

            <span>03</span>
            <h3>AI Intelligence</h3>
            <p>Understand what your financial data means.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <p className="section-label">HOW IT WORKS</p>

          <h2>
            Your financial controller,
            <span> powered by intelligence</span>
          </h2>

          <p>
            A simple workflow designed to help you move from financial data to
            clearer decisions.
          </p>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-top">
              <span>01</span>
              <div className="step-icon">
                <Wallet size={18} />
              </div>
            </div>

            <h3>Connect Your Data</h3>

            <p>
              Bring your transaction and financial data into FinSight AI.
            </p>
          </div>

          <div className="step">
            <div className="step-top">
              <span>02</span>
              <div className="step-icon">
                <BarChart3 size={18} />
              </div>
            </div>

            <h3>Analyze Automatically</h3>

            <p>
              FinSight processes your data and identifies patterns,
              inconsistencies, and financial trends.
            </p>
          </div>

          <div className="step">
            <div className="step-top">
              <span>03</span>
              <div className="step-icon">
                <BrainCircuit size={18} />
              </div>
            </div>

            <h3>Make Better Decisions</h3>

            <p>
              Use analytics and AI-powered insights to understand your finances
              and make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-icon">
          <BrainCircuit size={22} />
        </div>

        <p className="cta-label">FINANCIAL INTELLIGENCE, SIMPLIFIED</p>

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
        <div className="footer-brand">
          <Link to="/" className="logo">
            FinSight<span>AI</span>
          </Link>

          <p>AI-Powered Financial Controller</p>
        </div>

        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login">Login</Link>
        </div>

        <p className="copyright">
          © 2026 FinSight AI. Built for smarter financial decisions.
        </p>
      </footer>
    </div>
  );
}

export default Landing;