/* eslint-disable react/prop-types */
import { useTasksStore } from "../../store/useTasksStore";
import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateTaskToast } from "../Toast";

export default function EditTask({ task, onClose }) {
  const updateTask = useTasksStore((state) => state.updateTask);
  const [newTask, setNewTask] = useState(task);

  const resetForm = () => {
    setNewTask({ task: "", estimated: 1 });
  };

  const saveChanges = () => {
    const trimmed = newTask.task.trim();
    if (!trimmed) return;

    updateTask(task.id, {
      task: trimmed,
      estimated: newTask.estimated,
    });

    UpdateTaskToast(trimmed);
    resetForm();
    onClose();
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") saveChanges();
    if (e.key === "Escape") {
      resetForm();
      onClose();
    }
  };

  const increment = () =>
    setNewTask((prev) => ({ ...prev, estimated: prev.estimated + 1 }));

  const decrement = () =>
    setNewTask((prev) => ({
      ...prev,
      estimated: Math.max(prev.completed, prev.estimated - 1),
    }));

  return (
    <DialogContent onKeyDown={handleKeyDown} className="items-start">
      <DialogHeader className="items-start">
        <DialogTitle className="text-left">Edit task</DialogTitle>
        <DialogDescription className="text-left">
          Update the task details.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 w-full">
        {/* Task Input */}
        <div className="w-full">
          <Label htmlFor="taskName" className="text-left">
            Task
          </Label>
          <Input
            id="taskName"
            value={newTask.task}
            onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
            placeholder="What's on your mind?"
            autoFocus
            className="w-full"
          />
        </div>

        {/* Pomodoro Sessions */}
        <div className="w-full">
          <Label htmlFor="estimated" className="text-left">
            Pomodoro sessions
          </Label>
          <div className="flex items-center gap-3 mt-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrement}
              disabled={newTask.estimated <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{newTask.estimated}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={increment}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <div className="flex flex-row gap-2 w-full justify-end">
          <Button variant="outline" onClick={onClose} className="w-auto">
            Cancel
          </Button>
          <Button onClick={saveChanges} className="w-auto">
            Save Changes
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
