/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { getCurrentUser } from "../backend/auth";
import { Navigate, Outlet } from "react-router-dom";
import { useTimerStore } from "../store/useTimerStore";
import { useTasksStore } from "../store/useTasksStore";
import { useReportsStore } from "../store/useReportsStore";
import Loader from "../components/Loader";
import { fetchCurrentTask, fetchTasks } from "../backend/db";

export default function ProtectedRoute() {
  const { user, setUser, isLoading } = useAuthStore();

  const initTimerSettings = useTimerStore((state) => state.initTimerSettings);
  const initTasks = useTasksStore((state) => state.initTasks);
  const initLeaderBoard = useReportsStore((state) => state.initLeaderBoard);
  const initReports = useReportsStore((state) => state.initReports);
  const setLoading = useAuthStore((state) => state.setLoading);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);

        await initTimerSettings();
        setLoading();
        await initTasks();

        // these can continue in background
        initReports();
        initLeaderBoard(user);
      } catch (err) {
        setUser(null);
        setLoading();
      }
    };

    if (user === null && isLoading) checkUser();
  }, [
    user,
    isLoading,
    setUser,
    setLoading,
    initTimerSettings,
    initTasks,
    initReports,
    initLeaderBoard,
  ]);

  const secondsRemaining = useTimerStore((state) => state.secondsRemaining);
  const mode = useTimerStore((state) => state.mode);

  const pomodoro = useTimerStore((state) => state.pomodoro);
  const startedAt = useTimerStore((state) => state.startedAt);
  const startCountdown = useTimerStore((state) => state.startCountdown);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const status = useTimerStore((state) => state.status);
  const finishPomodoro = useTimerStore((state) => state.finishPomodoro);
  const finishBreak = useTimerStore((state) => state.finishBreak);
  const secsCompletedAtPause = useTimerStore(
    (state) => state.secsCompletedAtPause,
  );
  let tasks = useTasksStore((state) => state.tasks);
  let currentTaskId = useTasksStore((state) => state.currentTask);
  let currentTask = tasks.find((t) => t.id === currentTaskId);
  let currentTaskName = currentTask?.task;
  const updateCurrentTask = useTasksStore((state) => state.updateCurrentTask);
  const updateTask = useTasksStore((state) => state.updateTask);

  // reports store
  const addTimeLine = useReportsStore((state) => state.addTimeLine);

  useEffect(() => {
    const time =
      `${Math.floor(secondsRemaining / 60)}`.padStart(2, "0") +
      " : " +
      `${secondsRemaining % 60}`.padStart(2, "0");
    if (user) {
      document.title =
        time.replaceAll(" ", "") +
        " - " +
        (mode === "pomodoro" ? "Time to focus" : "Time for a break");

      const favicon = document.querySelector("link[rel='icon']");
      favicon.href =
        mode === "pomodoro"
          ? "/pomodoro.ico"
          : mode === "shortBreak"
            ? "/shortBreak.ico"
            : "/longBreak.ico";
    }
  }, [mode, secondsRemaining]);

  useEffect(() => {
    if (status === "started") {
      startCountdown();
    } else if (status === "paused") {
      pauseTimer();
    }
  }, [status]);

  useEffect(() => {
    (async function () {
      if (secondsRemaining <= 0) {
        if (!currentTaskId && !currentTask) {
          tasks = await fetchTasks();
          currentTaskId = (await fetchCurrentTask()).currentTaskId;
          currentTask = tasks.find((t) => t.id === currentTaskId);
          currentTaskName = currentTask?.task;
        }

        if (mode === "pomodoro") {
          // when a pomodoro session gets finished
          finishPomodoro();
          updateTask(currentTaskId, {
            completed: currentTask?.completed + 1,
          });
          addTimeLine(
            currentTaskName,
            startedAt,
            new Date(
              startedAt.getTime() +
                pomodoro * 60 * 1000 -
                secsCompletedAtPause * 1000,
            ),
          );
        } else {
          // when a break session gets finished
          finishBreak();
          if (currentTask.completed + 1 >= currentTask.estimated) {
            const nextTaskId = tasks.find(
              (t) => t.id !== currentTask && t.completed < t.estimated,
            )?.id;
            nextTaskId && updateCurrentTask(nextTaskId);
          }
        }

        new Audio("sounds/alarm-bell.mp3").play();
      }
    })();
  }, [secondsRemaining]);

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
