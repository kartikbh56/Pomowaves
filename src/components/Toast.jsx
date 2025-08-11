import { toast } from "sonner";
import { Flame } from "lucide-react";

export function StreakToast(streak) {
  toast(
    <div className="w-full flex items-center justify-center gap-2 text-center">
      <Flame className="text-orange-500" />
      <strong>{streak}</strong> days streak!
    </div>,
    { duration: 10000, position: "top-center" },
  );
}

export function AddTaskToast(task) {
  toast.success(
    <div className="w-full text-center">
      <strong>{task} </strong>added
    </div>,
    { position: "bottom-center" },
  );
}

export function UpdateTaskToast(task) {
  toast.success(
    <div className="w-full text-center">
      <strong>{task} </strong>updated
    </div>,
    { position: "bottom-center" },
  );
}

export function DeleteTaskToast(task) {
  toast.success(
    <div className="w-full text-center">
      <strong>{task} </strong>deleted
    </div>,
    { position: "bottom-center" },
  );
}

export function CurrentTaskToast(currentTask) {
  toast.success(
    <div className="w-full text-center">
      Current task: <strong>{currentTask}</strong>
    </div>,
    { position: "bottom-center" },
  );
}

export function SettingsSavedToast() {
  toast.success(<div className="w-full text-center">Settings Saved</div>, {
    position: "bottom-center",
  });
}

export function DeleteTimelineToast(timeline) {
  toast.success(
    <div className="w-full text-center">
      <strong>{timeline}</strong> deleted
    </div>,
    { position: "bottom-center" },
  );
}

export function AddTimelineToast(timeline, minutes) {
  toast.success(
    <div className="w-full text-center">
      Progress saved: <strong>{timeline}</strong> <strong>({minutes})</strong>
    </div>,
    { position: "bottom-center" },
  );
}

export function TasksFinishedToast() {
  toast.success(
    <div className="w-full text-center">
      You have finished all your tasks 🎉
    </div>,
    {
      position: "bottom-center",
      duration: 10000,
    },
  );
}
