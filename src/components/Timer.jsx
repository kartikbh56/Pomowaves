/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import Progress from "./Progress";

export default function Timer({
  timerState,
  dispatchTimerState,
  countdownState,
  dispatchCountdown,
  tasksState,
  dispatchTasks,
}) {
  const {
    timerId,
    status,
    mode,
    completedPomodoros,
    autoStartBreaks,
    autoStartPomodoros,
    timers,
  } = timerState;
  const { secondsRemaining } = countdownState;
  useEffect(() => {
    timerId && clearTimeout(timerId);
    if (status === "started") {
      const timerId = setInterval(() => {
        dispatchCountdown({ type: "countdown" });
      }, 1000);
      dispatchTimerState({ type: "setTimerId", timerId: timerId });
      return () => clearInterval(timerId);
    } else if (status === "paused") {
      clearInterval(timerId);
      dispatchTimerState({ type: "setTimerId", timerId: null });
    }
  }, [status]);
  useEffect(() => {
    if (secondsRemaining <= 0) {
      // dispatch({ type: "finished" });
      if (timerState.mode === "pomodoro") {
        const completedPomodoros = timerState.completedPomodoros + 1;
        const nextMode =
          completedPomodoros % timerState.timers.longBreakInterval === 0
            ? "longBreak"
            : "shortBreak";
        const secondsRemaining = timerState.timers[nextMode] * 60;
        const timeFocused = {
          hours:
            timerState.timeFocused.hours +
            Math.floor(timerState.timers.pomodoro / 60),
          minutes:
            timerState.timeFocused.minutes +
            Math.floor(timerState.timers.pomodoro % 60),
        };

        const currentTask = tasksState.currentTask
          ? tasksState.tasks.find((t) => t.id === tasksState.currentTask)
          : tasksState.currentTask;
        const nextTask = currentTask
          ? currentTask.completed + 1 >= currentTask.estimated
            ? tasksState.tasks.find(
                (t) =>
                  t.id !== tasksState.currentTask && t.completed < t.estimated
              )?.id
            : tasksState.currentTask
          : tasksState.currentTask;
        const newTasks = tasksState.tasks.map((task) =>
          task.id === tasksState.currentTask
            ? { ...task, completed: task.completed + 1 }
            : task
        );

        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: secondsRemaining,
        });
        dispatchTimerState({
          type: "finishedPomodoro",
          completedPomodoros: completedPomodoros,
          mode: nextMode,
          timerId: null,
          timeFocused: timeFocused,
          status: "initial",
        });
        dispatchTasks({
          type: "setTasks",
          tasks: newTasks,
          currentTask: nextTask,
        });
      } else {
        const secondsRemaining = timerState.timers.pomodoro * 60;
        const nextMode = "pomodoro";
        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: secondsRemaining,
        });
        dispatchTimerState({
          type: "finishedBreak",
          mode: nextMode,
          timerId: null,
          status: "initial",
        });
      }
      let bellRings =
        (completedPomodoros + 1) % timers.longBreakInterval === 0
          ? timers.longBreakInterval
          : (completedPomodoros + 1) % timers.longBreakInterval;
      clearInterval(timerId);
      let id = setInterval(() => {
        new Audio("sounds/button.mp3").play();
      }, 200);
      setTimeout(() => {
        clearInterval(id);
      }, 200 * bellRings);
    }
  }, [secondsRemaining, completedPomodoros]);
  const progressPercent =
    100 - (secondsRemaining * 100) / (timerState.timers[mode] * 60);
  const firstClick = useRef(false);
  return (
    <>
      <Progress percentage={progressPercent} />
      <TimerContainer>
        <TimerNavigation
          timers={timers}
          mode={mode}
          dispatchTimerState={dispatchTimerState}
          dispatchCountdown={dispatchCountdown}
          firstClick={firstClick}
        />
        <Time secondsRemaining={secondsRemaining} />
        <StartButton
          status={status}
          mode={mode}
          dispatch={dispatchTimerState}
          autoStartBreaks={autoStartBreaks}
          autoStartPomodoros={autoStartPomodoros}
          dispatchTasks={dispatchTasks}
          firstClick={firstClick}
          tasksState={tasksState}
        />
      </TimerContainer>
    </>
  );
}
function TimerContainer({ children }) {
  return <div className="timer">{children}</div>;
}
function TimerNavigation({
  timers,
  mode,
  dispatchTimerState,
  dispatchCountdown,
  firstClick,
}) {
  const selected = {
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  };
  const buttons = ["pomodoro", "shortBreak", "longBreak"].map((btn) => (
    <button
      style={mode === btn ? selected : {}}
      key={btn}
      onClick={() => {
        dispatchTimerState({
          type: "changeMode",
          mode: btn,
          status: "initial",
          timerId: null,
        });
        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: timers[btn] * 60,
        });
        firstClick.current = false;
      }}
    >
      {btn === "pomodoro" && "Pomodoro"}
      {btn === "shortBreak" && "Short Break"}
      {btn === "longBreak" && "Long Break"}
    </button>
  ));
  useEffect(() => {
    let backgroundColor;
    if (mode === "pomodoro") backgroundColor = "#ba4a49";
    if (mode === "shortBreak") backgroundColor = "#38868a";
    if (mode === "longBreak") backgroundColor = "#7e53a2";
    document.body.style.backgroundColor = backgroundColor;
  }, [mode]);
  return <div className="timernav">{buttons}</div>;
}

function Time({ secondsRemaining }) {
  return (
    <div className="time">
      {`${Math.floor(secondsRemaining / 60)}`.padStart(2, "0") +
        " : " +
        `${secondsRemaining % 60}`.padStart(2, "0")}
    </div>
  );
}

function StartButton({
  status,
  mode,
  dispatch,
  dispatchTasks,
  autoStartBreaks,
  autoStartPomodoros,
  firstClick,
  tasksState,
}) {
  const buttonRef = useRef(null);
  useEffect(() => {
    if (firstClick.current) {
      if (
        (mode === "pomodoro" && autoStartPomodoros && status === "initial") ||
        ((mode === "shortBreak" || mode === "longBreak") &&
          autoStartBreaks &&
          status === "initial")
      ) {
        const timer = setTimeout(() => {
          buttonRef.current.click();
        }, 1500);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [mode, autoStartBreaks, status, firstClick.current]);
  function handleClick() {
    firstClick.current = true;
    status === "started"
      ? dispatch({ type: "paused" })
      : dispatch({ type: "started" });
    if (status === "initial" && mode === "pomodoro" && tasksState.currentTask)
      dispatchTasks({ type: "sortTasks" });

    const currentTask = tasksState.currentTask
          ? tasksState.tasks.find((t) => t.id === tasksState.currentTask)
          : tasksState.currentTask;
    if(currentTask.completed>=currentTask.estimated && mode==="pomodoro"){
      const newTasks = tasksState.tasks.map((task) =>
        task.id === currentTask.id
          ? { ...task, estimated:task.estimated+1 }
          : task
      );
      dispatchTasks({type:"setTasks",tasks:newTasks,currentTask:currentTask.id})
      dispatchTasks({ type: "sortTasks" });
    }
    new Audio("sounds/finger-snap.mp3").play();
  }
  const btnColor =
    mode === "pomodoro"
      ? "rgb(186, 73, 73)"
      : mode === "shortBreak"
      ? "rgb(56, 134, 138)"
      : "rgb(126, 83, 162)";
  return (
    <button
      className="startbtn"
      style={{
        color: btnColor,
        boxShadow: status === "started" && "none",
        transform: status === "started" && "translateY(6px)",
      }}
      ref={buttonRef}
      onClick={handleClick}
    >
      {status === "started" ? "PAUSE" : "START"}
    </button>
  );
}
