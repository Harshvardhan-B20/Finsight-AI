import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Transactions from "./pages/Transactions/Transactions";
import Analytics from "./pages/Analytics/Analytics";
import Reconciliation from "./pages/Reconciliation/Reconciliation";
import Settings from "./pages/Settings/Settings";
import AIAssistant from "./pages/AI Assistant/AIAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />

        <Route
          path="/reconciliation"
          element={<Reconciliation />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/ai-assistant"
          element={<AIAssistant />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;