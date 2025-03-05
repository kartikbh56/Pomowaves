import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from "./components/Settings/Settings.jsx";
import Tasks from "./components/Tasks/Tasks.jsx";
import Summary from "./components/Summary.jsx";
import Timer from "./components/Timer/Timer.jsx";
import Navbar from "./components/Navbar.jsx";
import Reports from "./components/Reports/ReportsMenu.jsx";
import Auth from "./components/Auth.jsx";
// import { IsOpenContextProvider } from "./contexts/context.js";
import { Toaster } from "react-hot-toast";
import { ContextProvider } from "./contexts/ContextProvider.jsx";

export default function App() {
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/*"
          element={
            <div className="app">
              <ContextProvider>
                <Navbar />
                <Settings />
                <Reports />
                <Timer />
                <Tasks />
                <Summary />
                <Toaster style={{ zIndex: 1100 }} />
              </ContextProvider>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
