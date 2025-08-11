import { MoreHorizontal, RotateCcw, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTasksStore } from "../../store/useTasksStore";
import { DeleteTaskToast, UpdateTaskToast } from "../Toast";

export default function TaskOptions() {
  const tasks = useTasksStore((state) => state.tasks);
  const updateTask = useTasksStore((state) => state.updateTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);

  const taskOptions = [
    {
      label: "Reset tasks progress",
      icon: RotateCcw,
      onSelect: () => {
        tasks.forEach((task) => {
          updateTask(task.$id, { completed: 0 });
          UpdateTaskToast(task.task);
        });
      },
    },
    {
      label: "Clear finished tasks",
      icon: CheckCircle,
      onSelect: () => {
        tasks.forEach((task) => {
          if (task.completed >= task.estimated) {
            deleteTask(task.$id || task.id);
          }
        });
      },
    },
    {
      label: "Clear all tasks",
      icon: Trash2,
      onSelect: () => {
        tasks.forEach((task) => {
          deleteTask(task.$id || task.id);
          DeleteTaskToast(task.task);
        });
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {taskOptions.map((option, index) => (
          <DropdownMenuItem key={index} onSelect={option.onSelect}>
            <option.icon className="h-4 w-4 mr-2 text-muted-foreground" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
