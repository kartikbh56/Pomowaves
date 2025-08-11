import { create } from "zustand";
import {
  createTimerSettings,
  fetchTimerSettings,
  updateTimerSettings,
} from "../backend/db";
import { SettingsSavedToast } from "../components/Toast";
import { devtools } from "zustand/middleware";
import { sendNotification } from "../utils/notification";

const initialTimerSettings = {
  pomodoro: 25, // minutes
  shortBreak: 5, // minutes
  longBreak: 15, // minutes
  longBreakInterval: 4,
  autoStartPomodoros: false, // settings
  autoStartBreaks: false, // settings
  status: "initial", // initial, started, paused
  mode: "pomodoro", // pomodoro, shortBreak, longBreak
  completedPomodoros: 0,
  startedAt: null,
  secsCompletedAtPause: 0,
  $id: null,
};

export const useTimerStore = create(
  devtools(
    (set, get) => ({
      ...initialTimerSettings,
      secondsRemaining: initialTimerSettings[initialTimerSettings.mode] * 60,
      timerId: null,
      // setters

      // fetching  timer settings from the db
      initTimerSettings: async () => {
        const data = await fetchTimerSettings();
        if (!data) {
          // if there's no document associated with the user (new user), create one
          const timerSettings = await createTimerSettings({
            ...initialTimerSettings,
            lastAccessed: new Date().toISOString(),
          });
          set({
            ...timerSettings,
            lastAccessed: new Date(timerSettings.lastAccessed),
          });
        } else {
          // if already exists
          const secondsRemaining =
            data[data.mode] * 60 - data.secsCompletedAtPause;
          set({
            ...data,
            startedAt: data.startedAt && new Date(data.startedAt),
            lastAccessed: new Date(data.lastAccessed),
            secondsRemaining: secondsRemaining,
          });

          // reset completedPomodoros every day
          if (
            new Date(data.lastAccessed).toDateString() !==
            new Date().toDateString()
          ) {
            updateTimerSettings(data.$id, {
              completedPomodoros: 0,
            }).then(() => set({ completedPomodoros: 0 }));
          }
          updateTimerSettings(data.$id, {
            lastAccessed: new Date().toISOString(),
          });
        }
      },

      startTimer: () => {
        const $id = get().$id;
        const startedState = {
          status: "started",
          startedAt: new Date(),
        };
        set({ ...startedState });
        updateTimerSettings($id, {
          ...startedState,
          startedAt: startedState.startedAt.toISOString(),
        });
      },

      startCountdown: () => {
        if (get().timerId) return; // prevent multiple intervals

        const mode = get().mode;
        const currentTimer = get()[mode] * 60;
        const secsCompletedAtPause = get().secsCompletedAtPause;
        const startedAt = get().startedAt;

        const timerId = setInterval(() => {
          const currentTime = Date.now();
          const timeElapsed = Math.floor((currentTime - startedAt) / 1000);
          const secondsRemaining =
            currentTimer - secsCompletedAtPause - timeElapsed;
          set({ secondsRemaining });
        }, 1000);

        set({ timerId });
      },

      pauseTimer: () => {
        clearInterval(get().timerId);
        set({ timerId: null });

        const secondsRemaining = get().secondsRemaining;
        const mode = get().mode;
        const currentTimer = get()[mode] * 60;
        const $id = get().$id;

        const secsCompletedAtPause = currentTimer - secondsRemaining;
        const pausedState = {
          status: "paused",
          startedAt: null,
          secsCompletedAtPause: secsCompletedAtPause,
        };
        set(pausedState);

        updateTimerSettings($id, pausedState);
      },

      finishPomodoro: () => {
        const completedPomodoros = get().completedPomodoros + 1;
        const longBreakInterval = get().longBreakInterval;
        const $id = get().$id;
        const nextMode =
          completedPomodoros % longBreakInterval === 0
            ? "longBreak"
            : "shortBreak";

        const secondsRemaining = get()[nextMode] * 60;
        const finishedPomodoroState = {
          completedPomodoros: completedPomodoros,
          mode: nextMode,
          status: "initial",
          startedAt: null,
          secsCompletedAtPause: 0,
        };
        clearInterval(get()?.timerId);
        set({
          ...finishedPomodoroState,
          secondsRemaining: secondsRemaining,
          timerId: null,
        });

        //db
        updateTimerSettings($id, finishedPomodoroState);

        sendNotification(`Time to take a ${nextMode.split("B")[0]} break!`);
      },

      finishBreak: () => {
        const nextMode = "pomodoro";
        const secondsRemaining = get()[nextMode] * 60;
        const finishedBreakState = {
          mode: nextMode,
          status: "initial",
          startedAt: null,
          secsCompletedAtPause: 0,
        };
        clearInterval(get().timerId);
        set({
          ...finishedBreakState,
          timerId: null,
          secondsRemaining: secondsRemaining,
        });
        //db
        updateTimerSettings(get().$id, finishedBreakState);
        sendNotification("Time to Focus!");
      },

      saveSettings: (timerSettings) => {
        const mode = get().mode;
        const status = get().status;
        let secondsRemaining;

        if (status === "started") {
          // Timer is running
          const startedAt = get().startedAt;
          const now = Date.now();
          const elapsed = Math.floor((now - startedAt) / 1000) + get().secsCompletedAtPause;
          secondsRemaining = timerSettings[mode] * 60 - elapsed;
          if (secondsRemaining < 0) secondsRemaining = 0;

          // Clear current interval
          clearInterval(get().timerId);
          set({ timerId: null });

          // Update state with new settings and secondsRemaining (do not touch startedAt or secsCompletedAtPause)
          set({
            ...timerSettings,
            secondsRemaining,
          });

          // Start a new interval that keeps using the same startedAt
          const timerId = setInterval(() => {
            const currentTime = Date.now();
            const elapsedInner = Math.floor((currentTime - startedAt) / 1000) + get().secsCompletedAtPause;
            const updatedSecondsRemaining = timerSettings[mode] * 60 - elapsedInner;
            set({ secondsRemaining: updatedSecondsRemaining >= 0 ? updatedSecondsRemaining : 0 });
          }, 1000);
          set({ timerId });
        } else if (status === "paused") {
          // Timer is paused
          secondsRemaining = timerSettings[mode] * 60 - get().secsCompletedAtPause;
          if (secondsRemaining < 0) secondsRemaining = 0;
          set({
            ...timerSettings,
            secondsRemaining,
          });
        } else {
          // Timer is not running
          secondsRemaining = timerSettings[mode] * 60;
          set({
            ...timerSettings,
            secondsRemaining,
          });
        }

        updateTimerSettings(get().$id, {
          ...timerSettings,
        }).then(() => SettingsSavedToast());
      },

      changeMode: (btn) => {
        const changeModeState = {
          mode: btn,
          status: "initial",
          secsCompletedAtPause: 0,
          startedAt: null,
        };
        set({
          ...changeModeState,
          secondsRemaining: get()[btn] * 60,
        });
        clearInterval(get().timerId);
        set({ timerId: null });
        //db
        updateTimerSettings(get().$id, changeModeState);
      },
    }),
    { name: "timer store" },
  ),
);
