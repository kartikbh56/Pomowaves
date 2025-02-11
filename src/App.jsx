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
import { createTimerSettings, fetchTimerSettings } from "./api/db.js";

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
      console.log("currentUser", currentUser);
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
        createTimerSettings(timerState).then(data=>{
          dispatchTimerState({
            type: "initializeTimerSettings",
            timerSettings: {
              ...data,
              startedAt: new Date(data.startedAt).getTime(),
            },
          });
        })
      } else {

        // if already exists
        dispatchTimerState({
          type: "initializeTimerSettings",
          timerSettings: {
            ...data,
            startedAt: new Date(data.startedAt).getTime(),
          },
        });
        const secondsRemaining = data[data.mode] * 60;
        
        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: secondsRemaining,
        });

        // console.log("%c secondsRemaining","{background-color:'yellow'}",secondsRemaining)
        // console.log("%c secondsRemaining","{background-color:'yellow'}",secondsRemaining)
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
