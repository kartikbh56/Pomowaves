/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from "react";
import Progress from "../Progress";
import { CountdownContext, TasksContext, TimerContext } from "../Contexts/Context";
import TimerNavigation from "./TimerNavigation";
import Time from "./Time";
import StartButton from "./StartButton";

export default function Timer() {
  
  const {timerState, dispatchTimerState} = useContext(TimerContext)
  const {countdownState, dispatchCountdown} = useContext(CountdownContext)
  const {tasksState, dispatchTasks} = useContext(TasksContext)

  const {
    timerId,
    status,
    mode,
    completedPomodoros,
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
      if (mode === "pomodoro") {
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
      <div className="timer">
        <TimerNavigation firstClick={firstClick}/>
        <Time secondsRemaining={secondsRemaining} />
        <StartButton
          firstClick={firstClick}
        />
      </div>
    </>
  );
}