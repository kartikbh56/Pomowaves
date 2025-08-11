/* eslint-disable react/prop-types */
import {
  CircleCheck,
  Edit,
  LoaderCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Dialog } from "@/components/ui/dialog";
import EditTask from "./EditTask";

export default function TaskRow({
  task,
  isCurrentTask,
  onSelect,
  onDeleteTask,
}) {
  const [editingTask, setEditingTask] = useState(null);
  const status = getTaskStatus(task);
  const progressPercentage = (task.completed / task.estimated) * 100;

  const badgeClass = `text-xs ${getStatusBadgeStyles(
    status.type,
  )} rounded-full`;

  return (
    <>
      <div
        className={`px-2 py-2 cursor-pointer transition-all duration-200 hover:bg-muted/30 ${
          isCurrentTask ? "border-l-4 border-l-primary" : ""
        }`}
        onClick={onSelect}
      >
        <div className="grid grid-cols-11 gap-2 items-center">
          {/* Status Icon */}
          <div className="col-span-1 flex justify-center">
            <TaskStatusIcon task={task} isCurrentTask={isCurrentTask} />
          </div>

          {/* Task Name */}
          <div className="col-span-3 min-w-0">
            <div className="flex flex-col">
              <span className={`text-xs sm:text-base`}>{task.task}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="col-span-2">
            <Progress value={progressPercentage} className="w-12 h-2" />
          </div>

          {/* Status Badge */}
          <div className="col-span-2">
            <Badge className={badgeClass}>{status.text}</Badge>
          </div>

          {/* Pomodoro Count */}
          <div className="col-span-2 text-center flex justify-center">
            <span className={`text-xs sm:text-sm font-medium`}>
              {task.completed}/{task.estimated}
            </span>
          </div>

          {/* Actions */}
          <div className="col-span-1 flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTask(task);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {editingTask && (
        <Dialog open={true} onOpenChange={() => setEditingTask(null)}>
          <EditTask task={editingTask} onClose={() => setEditingTask(null)} />
        </Dialog>
      )}
    </>
  );
}

// Task Status utilities
const getTaskStatus = (task) => {
  if (task.completed === task.estimated)
    return { text: "Completed", type: "completed" };
  if (task.completed > 0) return { text: "In Progress", type: "inProgress" };
  return { text: "Pending", type: "pending" };
};

const getStatusBadgeStyles = (statusType) => {
  const styles = {
    completed:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    inProgress:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    pending:
      "bg-blue-100 text-blue-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
  };
  return styles[statusType];
};

// Task Status Icon Component
const TaskStatusIcon = ({ task }) => {
  const icons = {
    completed: <CircleCheck className="h-5 w-5 text-green-600" />,
    inProgress: <LoaderCircle className="h-5 w-5 text-orange-400" />,
    pending: <CircleCheck className="h-5 w-5 text-gray-400" />,
  };
  const statusType = getTaskStatus(task).type;
  return icons[statusType];
};
