import { Target } from "lucide-react";
import { useEffect } from "react";
import { useTimerStore } from "../../store/useTimerStore";
import { useTasksStore } from "../../store/useTasksStore";
import { getColor } from "../../utils/getColor";
import { CurrentTaskToast } from "../Toast";

export default function CurrentTask() {
  const mode = useTimerStore((state) => state.mode);
  const tasks = useTasksStore((state) => state.tasks);
  const currentTask = useTasksStore((state) => state.currentTask);
  const currentTaskName = tasks.find((e) => e.id === currentTask)?.task;

  useEffect(
    () => currentTaskName && CurrentTaskToast(currentTaskName),
    [currentTaskName],
  );

  const iconSize = "h-12 w-12";
  const targetIconSize = "h-6 w-6";
  const taskNumberClass = "text-sm";
  const taskNameClass = "text-lg";

  if (!currentTask) return null;
  return (
    <div className="flex justify-center align-center">
      <div className="flex items-center gap-3 max-w-sm">
        <div
          className={`${iconSize} rounded-full flex items-center justify-center flex-shrink-0`}
          style={{ backgroundColor: `${getColor(mode)}20` }}
        >
          <Target
            className={targetIconSize}
            style={{ color: getColor(mode) }}
          />
        </div>
        <div className="text-left">
          <p className={`${taskNumberClass} text-muted-foreground`}>
            Current Task
          </p>
          <p className={`font-semibold ${taskNameClass}`}>{currentTaskName}</p>
        </div>
      </div>
    </div>
  );
}
