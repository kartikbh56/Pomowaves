import { useReducer } from "react";
import Settings from "./components/Settings/Settings.jsx";
import Tasks from "./components/Tasks/Tasks.jsx";
import Summary from "./components/Summary.jsx";
import Timer from "./components/Timer/Timer.jsx";
import Navbar from "./components/Navbar.jsx";
import Reports from "./components/Reports/ReportsMenu.jsx";

import {
  TimerContext,
  TasksContext,
  IsOpenContext,
  CountdownContext,
  ReportsContext,
} from "./components/contexts/context.js";

import {
  initialTimerState,
  timerReducer,
} from "./components/Reducers/TimerReducer.js";

import {
  initialTasksState,
  tasksReducer,
} from "./components/Reducers/TaskReducer.js";

import {
  initialCountdownState,
  countdownReducer,
} from "./components/Reducers/CountdownReducer.js";

import {
  isOpenReducer,
  initialIsOpenState,
} from "./components/Reducers/IsOpenReducer.js";

import {
  reportsReducer,
  initialReports,
} from "./components/Reducers/ReportsReducer.js";

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

  return (
    <div className="app">
      <TimerContext.Provider value={{ timerState, dispatchTimerState }}>
        <TasksContext.Provider value={{ tasksState, dispatchTasks }}>
          <IsOpenContext.Provider value={{ isOpenState, dispatchIsOpen }}>
            <Navbar />
            <CountdownContext.Provider
              value={{ countdownState, dispatchCountdown }}
            >
              <ReportsContext.Provider
                value={{ reportsState, dispatchReports }}
              >
                {isOpenState.settings && <Settings />}
                {isOpenState.reports && <Reports />}
                <Timer />
              </ReportsContext.Provider>
            </CountdownContext.Provider>
          </IsOpenContext.Provider>
          <Tasks />
          {tasksState.tasks.length > 0 && <Summary />}
        </TasksContext.Provider>
      </TimerContext.Provider>
    </div>
  );
}

export default App;
