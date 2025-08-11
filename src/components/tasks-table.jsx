import { Target } from "lucide-react";
import { useTasksStore } from "../store/useTasksStore";
import TaskRow from "./TaskRow";
export default function TasksTable() {
  const tasks = useTasksStore((state) => state.tasks);
  const currentTask = useTasksStore((state) => state.currentTask);
  const updateCurrentTask = useTasksStore((state) => state.updateCurrentTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col">
        <TableHeader />
        <div className={"flex-1"}>
          {tasks.length === 0 ? (
            <EmptyTasksState />
          ) : (
            <div className="divide-y divide-border/50">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  isCurrentTask={task.id === currentTask}
                  task={task}
                  onSelect={() => updateCurrentTask(task.id)}
                  onDeleteTask={(id) => deleteTask(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Table Header Component
const TableHeader = () => (
  <div className="flex-shrink-0 bg-muted/50 border-b">
    <div className="px-3 py-3">
      <div className="grid grid-cols-11 gap-2 items-center text-sm font-medium text-muted-foreground">
        <div className="col-span-1 flex justify-center"></div>
        <div className="col-span-3 sm:col-span-4 min-w-0">Task</div>
        {/* Progress: hidden on mobile, shown md+ /}
        <div className="col-span-2 text-center hidden md:block">Progress</div>
        {/ Status: hidden on md and below, shown on lg+ */}
        <div className="col-span-2 text-center hidden lg:block">Status</div>
        <div className="col-span-2 text-center">Pomos</div>
        <div className="col-span-1"></div>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyTasksState = () => (
  <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
    <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
    <div className="text-center">
      <p className="text-base font-medium">No tasks yet</p>
      <p className="text-sm text-muted-foreground/70">
        Add your first task to get started!
      </p>
    </div>
  </div>
);
