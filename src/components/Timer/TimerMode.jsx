/* eslint-disable react/prop-types */

import { Button } from "@/components/ui/button";
import { useTimerStore } from "../../store/useTimerStore";
import { useTasksStore } from "../../store/useTasksStore";
import { useReportsStore } from "../../store/useReportsStore";
import { getColor } from "../../utils/getColor";

export default function TimerMode({ firstClick }) {
  const mode = useTimerStore((state) => state.mode);
  const changeMode = useTimerStore((state) => state.changeMode);
  const currentTaskId = useTasksStore((state) => state.currentTask);
  const tasks = useTasksStore((state) => state.tasks);
  const status = useTimerStore((state) => state.status);
  const startedAt = useTimerStore((state) => state.startedAt);
  const addTimeLine = useReportsStore((state) => state.addTimeLine);

  const currentModeColor = getColor(mode);

  const getModeLabel = (mode) => {
    return {
      shortBreak: "Short Break",
      longBreak: "Long Break",
      pomodoro: "Pomodoro",
    }[mode];
  };

  function handleClick(mode) {
    changeMode(mode);
    const currentTask = tasks?.find((t) => t.id === currentTaskId);
    const currentTaskName = currentTask?.task;
    if (
      mode === "pomodoro" &&
      status === "started" &&
      Math.floor((Date.now() - startedAt) / (1000 * 60)) > 0
    ) {
      addTimeLine(currentTaskName, startedAt, new Date());
    }
    firstClick.current = false;
  }

  return (
    <div className="flex justify-center backdrop-blur-md my-4">
      <div className="flex bg-muted p-1 rounded-full border lg:border-2">
        {["pomodoro", "shortBreak", "longBreak"].map((btn) => (
          <Button
            key={btn}
            variant={btn === mode ? "default" : "ghost"}
            size="sm"
            onClick={() => handleClick(btn)}
            className="capitalize text-xs sm:text-sm lg:text-sm px-2 sm:px-3 md:px-4 rounded-full transition-all duration-200"
            style={
              btn === mode
                ? {
                    backgroundColor: currentModeColor,
                    color: "white",
                    borderColor: currentModeColor,
                  }
                : {}
            }
          >
            {getModeLabel(btn)}
          </Button>
        ))}
      </div>
    </div>
  );
}
