import { useReducer } from "react";
import Settings from "./Components/Settings/Settings";
import Tasks from "./Components/Tasks/Tasks";
import Summary from "./Components/Summary";
import Timer from "./Components/Timer/Timer";
import Navbar from "./Components/Navbar";
import {
  TimerContext,
  TasksContext,
  IsOpenContext,
  CountdownContext,
} from "./Components/Contexts/Context";

import {
  initialTimerState,
  timerReducer,
} from "./Components/Reducers/TimerReducer";

import {
  initialTasksState,
  tasksReducer,
} from "./Components/Reducers/TaskReducer";

import {
  initialCountdownState,
  countdownReducer,
} from "./Components/Reducers/CountdownReducer";

import{
  initialIsOpenState,
  isOpenReducer
} from "./Components/Reducers/IsOpenReducer"

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

  return (
    <TimerContext.Provider value={{ timerState, dispatchTimerState }}>
      <TasksContext.Provider value={{ tasksState, dispatchTasks }}>
        <CountdownContext.Provider
          value={{ countdownState, dispatchCountdown }}
        >
          <IsOpenContext.Provider value={{ isOpenState, dispatchIsOpen }}>
            <div className="app">
              <Navbar />
              {isOpenState.settings && <Settings />}
              <Timer />
              <Tasks />
              {tasksState.tasks.length > 0 && <Summary />}
            </div>
          </IsOpenContext.Provider>
        </CountdownContext.Provider>
      </TasksContext.Provider>
    </TimerContext.Provider>
  );
}

export default App;
