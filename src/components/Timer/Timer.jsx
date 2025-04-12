/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import Progress from "../Progress";
import TimerNavigation from "./TimerNavigation";
import Time from "./Time";
import StartButton from "./StartButton";
import { useTimerStore } from "../../store/useTimerStore";
import { useTasksStore } from "../../store/useTasksStore";
import { useReportsStore } from "../../store/useReportsStore";
import { fetchCurrentTask, fetchTasks } from "../../appwrite backend/db";

export default function Timer() {
  const timerIdRef = useRef(null);

  // timer store
  const pomodoro = useTimerStore((state) => state.pomodoro);
  const startedAt = useTimerStore((state) => state.startedAt);
  const setCountdown = useTimerStore((state) => state.setCountdown);
  const secondsRemaining = useTimerStore((state) => state.secondsRemaining);
  const status = useTimerStore((state) => state.status);
  const mode = useTimerStore((state) => state.mode);
  const finishPomodoro = useTimerStore((state) => state.finishPomodoro);
  const finishBreak = useTimerStore((state) => state.finishBreak);
  const secsCompletedAtPause = useTimerStore(
    (state) => state.secsCompletedAtPause
  );
  const currentTimer = useTimerStore((state) => state[state.mode]); // current mode timer (pomodoro, shortBreak, longBreak)

  // tasks store
  let tasks = useTasksStore((state) => state.tasks);
  let currentTaskId = useTasksStore((state) => state.currentTask);
  let currentTask = tasks.find((t) => t.id === currentTaskId);
  let currentTaskName = currentTask?.task;
  const updateCurrentTask = useTasksStore((state) => state.updateCurrentTask);
  const updateTask = useTasksStore((state) => state.updateTask);

  // reports store
  const addTimeLine = useReportsStore((state) => state.addTimeLine);

  function startTimer(seconds) {
    timerIdRef.current = setInterval(() => {
      const currentTime = Date.now();
      const timeElapsed = Math.floor((currentTime - startedAt) / 1000);
      const secondsRemaining = seconds - timeElapsed;
      setCountdown(secondsRemaining);
    }, 1000);
  }

  useEffect(() => {
    if (status === "started") {
      startTimer(secondsRemaining);
    } else if (status === "paused") {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    return () => {
      clearInterval(timerIdRef.current);
    };
  }, [status, currentTimer]);

  useEffect(
    () =>
      async function () {
        if (secondsRemaining <= 0) {
          // when a timer gets finished
          clearInterval(timerIdRef.current);
          timerIdRef.current = null;
          if (mode === "pomodoro") {
            // when a pomodoro timer gets finished
            finishPomodoro();
            if (!currentTaskId && !currentTask) {
              tasks = await fetchTasks();
              currentTaskId = (await fetchCurrentTask()).currentTaskId;
              currentTask = tasks.find((t) => t.id === currentTaskId);
              currentTaskName = currentTask?.task;
            }
            updateTask(currentTaskId, {
              completed: currentTask?.completed + 1,
            });
            addTimeLine(
              currentTaskName,
              startedAt,
              new Date(
                startedAt.getTime() +
                  pomodoro * 60 * 1000 -
                  secsCompletedAtPause * 1000
              )
            );
          } else {
            finishBreak();
            if (currentTask.completed + 1 >= currentTask.estimated) {
              const nextTaskId = tasks.find(
                (t) => t.id !== currentTask && t.completed < t.estimated
              )?.id;
              nextTaskId && updateCurrentTask(nextTaskId);
            }
          }
          new Audio("sounds/button.mp3").play();
        }
      },
    [secondsRemaining]
  );
  const progressPercent = 100 - (secondsRemaining * 100) / (currentTimer * 60);
  const firstClick = useRef(false);
  return (
    <>
      <Progress percentage={progressPercent} />
      <div className="timer">
        <TimerNavigation firstClick={firstClick} />
        <Time secondsRemaining={secondsRemaining} />
        <StartButton firstClick={firstClick} />
      </div>
    </>
  );
}
