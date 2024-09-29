import { useReducer } from "react";
import Settings from "./Components/Settings/Settings";
import Tasks from "./Components/Tasks/Tasks";
import Summary from "./Components/Summary";
import Timer from "./Components/Timer/Timer"
import Navbar from "./Components/Navbar";
import { TimerContext,TasksContext, IsOpenContext, CountdownContext } from "./Components/Contexts/Context";

// initial states
// #1
const initialTimerState = {
  // (minutes)
  timers: {
    pomodoro: 0.1,
    shortBreak: 0.1,
    longBreak: 0.1,
    longBreakInterval: 4,
  },
  autoStartPomodoros: false, // settings
  autoStartBreaks: false, // settings
  timerId: null,
  status: "initial", // initial, started, paused, finished
  mode: "pomodoro", // pomodoro, shortBreak, longBreak
  completedPomodoros: 0,
  startedAt: null,
  timeFocused: { hours: 0, minutes: 0 },
};

// #2
const initialTasksState = {
  tasks: [
    {
      id: 1,
      task: "React.js",
      estimated: 5,
      completed: 4,
    },
    {
      id: 2,
      task: "Academics",
      estimated: 5,
      completed: 4,
    },
    {
      id: 3,
      task: "Project",
      estimated: 4,
      completed: 2,
    },
    {
      id: 4,
      task: "randomTask",
      estimated: 6,
      completed: 1,
    },
    {
      id: 5,
      task: "Random Task 3",
      estimated: 4,
      completed: 3,
    },
    {
      id: 6,
      task: "Random Task 4",
      estimated: 4,
      completed: 2,
    },
    {
      id: 7,
      task: "Random Task 5",
      estimated: 4,
      completed: 1,
    },
  ],
  currentTask: 1,
};

// #3
const initialCountdownState = {
  secondsRemaining: initialTimerState.timers[initialTimerState.mode] * 60,
};

// #4
const initialIsOpenState = {
  settings: false,
  reports: false,
};

// reducer functions

// #1
function timerReducer(timerState, action) {
  switch (action.type) {
    case "started":
      return {
        ...timerState,
        status: "started",
      };
    case "paused":
      return { ...timerState, status: "paused" };
    case "finishedPomodoro":
      return {
        ...timerState,
        completedPomodoros: action.completedPomodoros,
        mode: action.mode,
        timerId: action.timerId,
        timeFocused: action.timeFocused,
        status: action.status,
      };
    case "finishedBreak":
      return {
        ...timerState,
        mode: action.mode,
        timerId: action.timerId,
        status: action.status,
      };
    case "setTimerId":
      return {
        ...timerState,
        timerId: action.timerId,
      };
    case "changeTimerSettings":
      return {
        ...timerState,
        timers: action.timers,
        autoStartBreaks: action.autoStartBreaks,
        autoStartPomodoros: action.autoStartPomodoros,
      };
    case "changeMode":
      return {
        ...timerState,
        mode: action.mode,
        status: action.status,
        timerId: action.timerId,
      };
    // case "changeAutoStart":
    //   return {
    //     ...timerState,
    //     [action.autoStart]: !timerState[action.autoStart],
    //   };
  }
}

// #2
function tasksReducer(tasksState, action) {
  switch (action.type) {
    case "sortTasks":
      return {
        ...tasksState,
        tasks: tasksState.tasks.slice().sort((a, b) => {
          // sorting the tasks in such a way that, completed tasks stay at the bottom and current task at the top
          console.log("sorting");
          if (a.id === tasksState.currentTask) return -1;
          if (b.id === tasksState.currentTask) return 1;
          if (a.completed >= a.estimated && b.completed < b.estimated) return 1;
          if (b.completed >= b.estimated && a.completed < a.estimated)
            return -1;
          return 0;
        }),
      };
    case "setTasks":
      return { tasks: action.tasks, currentTask: action.currentTask };
    case "switchTask":
      return { ...tasksState, currentTask: action.id };
    case "modifyTask":
      return {
        ...tasksState,
        tasks: tasksState.tasks.map((task) =>
          task.id === action.id
            ? { ...task, task: action.title, estimated: action.estimated }
            : task
        ),
      };
    case "addTask":
      return {
        ...tasksState,
        tasks: [...tasksState.tasks, action.newTask],
        currentTask:
          tasksState.tasks.length === 0
            ? action.newTask.id
            : tasksState.currentTask,
      };
    case "deleteTask":
      return {
        ...tasksState,
        tasks: tasksState.tasks.filter((task) => task.id !== action.id),
      };
  }
}

// #3
function countdownReducer(countdownState, action) {
  switch (action.type) {
    case "countdown":
      return {
        ...countdownState,
        secondsRemaining: countdownState.secondsRemaining - 1,
      };
    case "setCountdown":
      return {
        ...countdownState,
        secondsRemaining: action.secondsRemaining,
      };
  }
}

// #4
function isOpenReducer(isOpenState, action) {
  switch (action.type) {
    case "toggleMenu":
      return {
        ...isOpenState,
        [action.menu]: !isOpenState[action.menu],
      };
  }
}

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
              <Timer/>
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
