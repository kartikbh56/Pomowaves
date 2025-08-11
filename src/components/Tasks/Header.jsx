import TaskOptions from "./TaskOptions";
import AddTask from "./AddTask";
import { useTasksStore } from "../../store/useTasksStore";
export default function Header() {
  const totalTasksCount = useTasksStore((state) => state.tasks.length);
  const completedTasksCount = useTasksStore(
    (state) => state.tasks.filter((t) => t.completed === t.estimated).length,
  );
  return (
    <div className="flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Tasks</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {totalTasksCount} total • {completedTasksCount} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddTask />
          <TaskOptions />
        </div>
      </div>
    </div>
  );
}
