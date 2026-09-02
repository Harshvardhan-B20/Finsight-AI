import {
  ArrowUp,
  BrainCircuit,
  Lightbulb,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

import "./AIAssistant.css";

const API_URL = "http://127.0.0.1:5100";

const AIAssistant = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "What's my current balance?",
    "How much did I spend on rent?",
    "What is my highest expense?",
    "Analyze my spending",
  ];

  const handleSend = async (customQuestion = null) => {
    const userQuestion = (
      customQuestion ?? question
    ).trim();

    if (!userQuestion || loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Your session has expired. Please log in again.",
        },
      ]);
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: userQuestion,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get AI response.",
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            data.answer ||
            "I couldn't generate an answer.",
        },
      ]);
    } catch (error) {
      console.error("AI Assistant error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error.message ||
            "Something went wrong while contacting FinSight AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    handleSend(suggestion);
  };

  return (
    <div className="ai-assistant-page">
      <div className="ai-assistant-header">
        <div>
          <span className="ai-page-label">
            FINANCIAL INTELLIGENCE
          </span>

          <h1>FinSight AI Assistant</h1>

          <p>
            Ask questions about your business finances
            and get intelligent answers from your
            financial data.
          </p>
        </div>

        <div className="ai-status">
          <span className="ai-status-dot"></span>
          AI Online
        </div>
      </div>

      <div className="ai-chat-container">
        {messages.length === 0 ? (
          <div className="ai-welcome">
            <div className="ai-welcome-icon">
              <BrainCircuit size={30} />
            </div>

            <h2>
              How can I help with your finances?
            </h2>

            <p>
              Ask FinSight about your income, expenses,
              balance, spending patterns, or financial
              health.
            </p>

            <div className="ai-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  className="ai-suggestion"
                  onClick={() =>
                    handleSuggestion(suggestion)
                  }
                  disabled={loading}
                >
                  <Lightbulb size={16} />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="ai-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-message ${
                  message.role === "user"
                    ? "ai-message-user"
                    : "ai-message-bot"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="ai-message-icon">
                    <Sparkles size={16} />
                  </div>
                )}

                <div className="ai-message-content">
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-message ai-message-bot">
                <div className="ai-message-icon">
                  <Sparkles size={16} />
                </div>

                <div className="ai-message-content">
                  FinSight AI is analyzing your financial
                  data...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ai-input-area">
        <div className="ai-input-wrapper">
          <MessageCircle size={19} />

          <input
            type="text"
            placeholder="Ask FinSight anything about your finances..."
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
          />

          <button
            className="ai-send-button"
            onClick={() => handleSend()}
            disabled={!question.trim() || loading}
            aria-label="Send question"
          >
            <ArrowUp size={19} />
          </button>
        </div>

        <p className="ai-disclaimer">
          FinSight AI analyzes your recorded financial
          data. AI responses should be reviewed before
          making important financial decisions.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;