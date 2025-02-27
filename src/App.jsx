import { useReducer, useEffect, useState } from "react";
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
import Loader from "./components/Loader.jsx";
import {
  TimerContext,
  TasksContext,
  IsOpenContext,
  CountdownContext,
  ReportsContext,
} from "./contexts/context.js";

import { initialTimerState, timerReducer } from "./Reducers/TimerReducer.js";

import { tasksReducer, initialTasksState } from "./Reducers/TaskReducer.js";

import {
  initialCountdownState,
  countdownReducer,
} from "./Reducers/CountdownReducer.js";

import { isOpenReducer, initialIsOpenState } from "./Reducers/IsOpenReducer.js";

import { reportsReducer, initialReports } from "./Reducers/ReportsReducer.js";

import { getCurrentUser } from "./api/auth.js";
import {
  createReport,
  createTimerSettings,
  fetchReports,
  fetchTimerSettings,
  initialFetchTimeline,
  updateReport,
} from "./api/db.js";

function App() {
  const [timerState, dispatchTimerState] = useReducer(
    timerReducer,
    initialTimerState
  );
  const [tasksState, dispatchTasks] = useReducer(
    tasksReducer,
    initialTasksState
  );
  const [countdownState, dispatchCountdown] = useReducer(
    countdownReducer,
    initialCountdownState
  );
  const [isOpenState, dispatchIsOpen] = useReducer(
    isOpenReducer,
    initialIsOpenState
  );
  const [reportsState, dispatchReports] = useReducer(
    reportsReducer,
    initialReports
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      // console.log("currentUser", currentUser);
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    fetchTimerSettings().then((data) => {
      if (!data?.$id) {
        // if there's no document in the collection.
        // create one for the user and update the states
        createTimerSettings(timerState).then((data) => {
          dispatchTimerState({
            type: "initializeTimerSettings",
            timerSettings: {
              ...data,
              startedAt: data.startedAt, // it's null because, it's being created for the first time.
            },
          });
        });
      } else {
        // if already exists
        dispatchTimerState({
          type: "initializeTimerSettings",
          timerSettings: {
            ...data,
            startedAt: new Date(data.startedAt).getTime() || null,
            // new Date(null).getTime() is 0, so, if `startedAt` fetched form db is null, then store it as it is in the state, converting it to Date() causes inaccurate time calculations.
          },
        });
        const secondsRemaining =
          data[data.mode] * 60 - data.secsCompletedAtPause;

        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: secondsRemaining,
        });
      }
    });

    initialFetchTimeline(8).then((data) => {
      dispatchReports({
        type: "fetchReports",
        reports: data.documents.map((r) => ({
          ...r,
          startedAt: new Date(r.startedAt),
          endedAt: new Date(r.endedAt),
        })),
        totalDocs: data.total,
      });
    });

    fetchReports().then((data) => {
      // console.log("this is what got for you", data);
      if (!data?.$id) {
        // if there's no document in the collection.
        // create one for the user and update the states
        const reports = {
          minutesFocused: reportsState.minutesFocused,
          daysAccessed: reportsState.daysAccessed,
          dayStreak: reportsState.dayStreak,
          lastAccessed: new Date(),
        };
        createReport(reports).then((data) => {
          dispatchReports({
            type: "initialFetchSummary",
            report: { ...data },
          });
        });
      } else {
        // if already exists

        const today = new Date();
        const lastAccessed = new Date(data.lastAccessed || new Date());

        let streak = data.dayStreak;
        let daysAccessed = data.daysAccessed;

        // this is calculated next day of lastAccessed day, if this day is equal to the current day, then increment the streak.
        const nextDay = new Date(
          lastAccessed.getFullYear(),
          lastAccessed.getMonth(),
          lastAccessed.getDate() + 1
        );

        console.log(
          "%c last accessed",
          "color:red;",
          lastAccessed.toDateString()
        );
        if (nextDay.toDateString() === today.toDateString()) {
          streak = streak + 1;
        } else if (Math.floor((today - lastAccessed) / (1000 * 60 * 60)) > 24) {
          streak = 1; // reset the streak if lastAccessed is more than 24 hours ago
        }

        daysAccessed =
          lastAccessed.getDate() !== today.getDate()
            ? daysAccessed + 1
            : daysAccessed;

        // console.log("Updated daysAccessed and dayStreak",{daysAccessed,streak})
        updateReport(data.$id, {
          dayStreak: streak,
          daysAccessed: daysAccessed,
          lastAccessed: new Date(),
        }).then((data) => {
          console.log("%c updated reports", "color:yellow;", data);
          dispatchReports({
            type: "updateReports",
            report: {
              dayStreak: data.dayStreak,
              daysAccessed: data.daysAccessed,
              minutesFocused: data.minutesFocused,
            },
          });
        });
      }
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/*"
          element={
            user ? (
              <div className="app">
                <TimerContext.Provider
                  value={{ timerState, dispatchTimerState }}
                >
                  <TasksContext.Provider value={{ tasksState, dispatchTasks }}>
                    <IsOpenContext.Provider
                      value={{ isOpenState, dispatchIsOpen }}
                    >
                      <Navbar user={user} />
                      <CountdownContext.Provider
                        value={{ countdownState, dispatchCountdown }}
                      >
                        <ReportsContext.Provider
                          value={{ reportsState, dispatchReports }}
                        >
                          {isOpenState.settings && <Settings />}
                          {isOpenState.reports && <Reports />}
                          <Timer />
                          <Tasks />
                          {tasksState.tasks.length > 0 && <Summary />}
                        </ReportsContext.Provider>
                      </CountdownContext.Provider>
                    </IsOpenContext.Provider>
                  </TasksContext.Provider>
                </TimerContext.Provider>
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

export default App;
