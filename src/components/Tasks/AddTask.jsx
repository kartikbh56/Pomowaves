/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import { useTasksStore } from "../../store/useTasksStore";
import { AddTaskToast } from "../Toast";

export default function AddTaskButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 text-xs sm:text-sm">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </DialogTrigger>
      <AddTaskDialog onClose={() => setOpen(false)} />
    </Dialog>
  );
}

function AddTaskDialog({ onClose }) {
  const addTask = useTasksStore((state) => state.addTask);
  const [newTask, setNewTask] = useState({ task: "", estimated: 1 });

  const resetForm = () => {
    setNewTask({ task: "", estimated: 1 });
  };

  const handleSubmit = () => {
    const trimmed = newTask.task.trim();
    if (!trimmed) return;

    addTask({
      id: crypto.randomUUID(),
      task: trimmed,
      estimated: newTask.estimated,
      completed: 0,
    });

    AddTaskToast(trimmed);
    resetForm();
    onClose();
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
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
      estimated: Math.max(1, prev.estimated - 1),
    }));

  return (
    <DialogContent onKeyDown={handleKeyDown} className="items-start">
      <DialogHeader className="items-start">
        <DialogTitle className="text-left">Add New Task</DialogTitle>
        <DialogDescription className="text-left">
          Create a new task to work on.
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
        <div>
          <Label htmlFor="estimated">Pomodoro sessions</Label>
          <div className="flex items-center gap-2 mt-1">
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
          <Button className="w-auto" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="w-auto" onClick={handleSubmit}>
            Add Task
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
