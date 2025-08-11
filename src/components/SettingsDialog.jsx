/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTimerStore } from "../store/useTimerStore";
import { useEffect } from "react";

export default function SettingsDialog({ open, onOpenChange }) {
  // Get current settings from Zustand store
  const pomodoro = useTimerStore((state) => state.pomodoro);
  const shortBreak = useTimerStore((state) => state.shortBreak);
  const longBreak = useTimerStore((state) => state.longBreak);
  const longBreakInterval = useTimerStore((state) => state.longBreakInterval);
  const autoStartBreaks = useTimerStore((state) => state.autoStartBreaks);
  const autoStartPomodoros = useTimerStore((state) => state.autoStartPomodoros);
  const saveSettings = useTimerStore((state) => state.saveSettings);

  // Local state for temporary changes
  const [timerSettings, setTimerSettings] = useState({
    pomodoro,
    shortBreak,
    longBreak,
    longBreakInterval,
    autoStartBreaks,
    autoStartPomodoros,
  });

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.key === "Enter" && open) {
        e.preventDefault();
        saveTimerSettings();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, timerSettings]);

  const handleInputChange = (field, value) => {
    setTimerSettings((prev) => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };

  const handleToggleChange = (field, checked) => {
    setTimerSettings((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const currentTimerSettings = {
    pomodoro,
    shortBreak,
    longBreak,
    longBreakInterval,
    autoStartPomodoros,
    autoStartBreaks,
  };
  const timerSettingsValues = Object.values(timerSettings);
  const currentTimerSettingsValues = Object.values(currentTimerSettings);

  // compare the values of timer settings in global state with the local state ones, saveSettings() only if they are different.
  const settingsChanged = timerSettingsValues.some(
    (value, index) => value !== currentTimerSettingsValues[index],
  );

  function saveTimerSettings() {
    if (settingsChanged) {
      saveSettings(timerSettings);
    }
    // close the dialog as well
    onOpenChange(false);
  }

  const handleCancel = () => {
    // Reset local state to global state values
    setTimerSettings({
      pomodoro,
      shortBreak,
      longBreak,
      autoStartBreaks,
      autoStartPomodoros,
      longBreakInterval,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your Pomodoro timer settings. Changes will be applied
            immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timer Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Timer (minutes)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pomodoro" className="text-xs">
                  Pomodoro
                </Label>
                <Input
                  id="pomodoro"
                  type="number"
                  min="1"
                  value={timerSettings.pomodoro}
                  onChange={(e) =>
                    handleInputChange("pomodoro", e.target.value)
                  }
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortBreak" className="text-xs">
                  Short Break
                </Label>
                <Input
                  id="shortBreak"
                  type="number"
                  min="0"
                  value={timerSettings.shortBreak}
                  onChange={(e) =>
                    handleInputChange("shortBreak", e.target.value)
                  }
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longBreak" className="text-xs">
                  Long Break
                </Label>
                <Input
                  id="longBreak"
                  type="number"
                  min="0"
                  value={timerSettings.longBreak}
                  onChange={(e) =>
                    handleInputChange("longBreak", e.target.value)
                  }
                  className="text-center"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Auto Start Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Auto Start
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoStartBreaks" className="text-sm">
                    Auto Start Breaks
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically start break timers
                  </p>
                </div>
                <Switch
                  id="autoStartBreaks"
                  checked={timerSettings.autoStartBreaks}
                  onCheckedChange={(checked) =>
                    handleToggleChange("autoStartBreaks", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoStartPomodoros" className="text-sm">
                    Auto Start Pomodoros
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically start pomodoro timers
                  </p>
                </div>
                <Switch
                  id="autoStartPomodoros"
                  checked={timerSettings.autoStartPomodoros}
                  onCheckedChange={(checked) =>
                    handleToggleChange("autoStartPomodoros", checked)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Long Break Interval */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Long Break Interval
            </h4>
            <div className="flex items-center space-x-3">
              <Label
                htmlFor="longBreakInterval"
                className="text-sm whitespace-nowrap"
              >
                Every
              </Label>
              <Input
                id="longBreakInterval"
                type="number"
                min="2"
                max="10"
                value={timerSettings.longBreakInterval}
                onChange={(e) =>
                  handleInputChange("longBreakInterval", e.target.value)
                }
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">pomodoros</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Take a long break after completing this many pomodoros
            </p>
          </div>
        </div>

        <DialogFooter className="">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={saveTimerSettings}
            disabled={!settingsChanged}
            className=""
          >
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
