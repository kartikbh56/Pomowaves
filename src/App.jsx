import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Settings from "./components/Settings/Settings.jsx";
import Tasks from "./components/Tasks/Tasks.jsx";
import Summary from "./components/Summary.jsx";
import Timer from "./components/Timer/Timer.jsx";
import Navbar from "./components/Navbar.jsx";
import Reports from "./components/Reports/ReportsMenu.jsx";
import Auth from "./components/Auth.jsx";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader.jsx";
import { useReportsStore } from "./store/useReportsStore.js";
import { useTimerStore } from "./store/useTimerStore.js";
import { useIsOpenStore } from "./store/useIsOpenStore.js";
import { useTasksStore } from "./store/useTasksStore.js";
import { getCurrentUser } from "./appwrite backend/auth.js";

export default function App() {
  const initTimeline = useReportsStore((state) => state.initTimeline);
  const initLeaderBoard = useReportsStore((state) => state.initLeaderBoard);
  const initReports = useReportsStore((state) => state.initReports);
  const initTimerSettings = useTimerStore((state) => state.initTimerSettings);
  const isSettingsOpen = useIsOpenStore((state) => state.settings);
  const isReportsOpen = useIsOpenStore((state) => state.reports);
  const initTasks = useTasksStore((state) => state.initTasks);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Notification.permission === "default" && Notification.requestPermission();

    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          initLeaderBoard(currentUser);
          await initTimerSettings();
          initTasks();
          initReports();
          initTimeline();
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth user={user} setUser={setUser} />} />
        <Route
          path="/"
          element={
            user ? (
              <div className="app">
                <Navbar user={user} setUser={setUser} />
                {isSettingsOpen && <Settings />}
                {isReportsOpen && <Reports />}
                <Timer />
                <Tasks />
                <Summary />
                <Toaster style={{ zIndex: 1100 }} />
              </div>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
