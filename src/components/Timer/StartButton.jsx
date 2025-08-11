/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useTimerStore } from "../../store/useTimerStore";
import { useTasksStore } from "../../store/useTasksStore";
import { useReportsStore } from "../../store/useReportsStore";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { getColor } from "../../utils/getColor";
import { Pause, Play } from "lucide-react";

export default function StartButton({ firstClick }) {
  // timerx
  const mode = useTimerStore((state) => state.mode);
  const autoStartBreaks = useTimerStore((state) => state.autoStartBreaks);
  const autoStartPomodoros = useTimerStore((state) => state.autoStartPomodoros);
  const status = useTimerStore((state) => state.status);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const startedAt = useTimerStore((state) => state.startedAt);
  const startTimer = useTimerStore((state) => state.startTimer);

  // tasks
  const tasks = useTasksStore((state) => state.tasks);
  const currentTask = useTasksStore((state) => state.currentTask);
  const sortTasks = useTasksStore((state) => state.sortTasks);

  // reports
  const addTimeLine = useReportsStore((state) => state.addTimeLine);
  const updateTask = useTasksStore((state) => state.updateTask);

  useEffect(() => {
    if (firstClick.current) {
      if (
        (mode === "pomodoro" && autoStartPomodoros && status === "initial") ||
        ((mode === "shortBreak" || mode === "longBreak") &&
          autoStartBreaks &&
          status === "initial")
      ) {
        const timer = setTimeout(() => {
          handleClick();
        }, 500);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [mode, autoStartBreaks, status, autoStartPomodoros, firstClick]);

  function handleClick() {
    new Audio("sounds/button.mp3").play();
    firstClick.current = true;

    if (status === "started") {
      // when paused
      pauseTimer();

      const currentTaskName = tasks.find((e) => e.id === currentTask)?.task;
      if (
        Math.floor((Date.now() - startedAt) / (1000 * 60)) > 0 &&
        mode === "pomodoro"
      ) {
        // If you pause the timer, add a report only if the focus time is more than 0 minutes
        addTimeLine(currentTaskName, startedAt, Date.now());
      }
    } else {
      startTimer();
    }

    if (status === "initial" && mode === "pomodoro" && currentTask) {
      sortTasks();

      const currentTaskObj = currentTask
        ? tasks.find((t) => t.id === currentTask)
        : tasks[0];

      if (
        currentTaskObj?.completed >= currentTaskObj?.estimated &&
        mode === "pomodoro"
      ) {
        updateTask(currentTask, { estimated: currentTaskObj.estimated + 1 });
      }
    }
  }

  const buttonClass = "px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base";

  const iconButtonSize = "h-4 w-4 sm:h-5 sm:w-5";

  return (
    <Button
      size="lg"
      onClick={handleClick}
      className={`${buttonClass} font-semibold transition-all duration-200 rounded-full border-3`}
      style={{ backgroundColor: getColor(mode), color: "white" }}
    >
      {status === "started" ? (
        <>
          <Pause className={`mr-2 ${iconButtonSize}`} />
          PAUSE
        </>
      ) : (
        <>
          <Play className={`mr-2 ${iconButtonSize}`} />
          START
        </>
      )}
    </Button>
  );
}
