import { create } from "zustand";
import {
  createTimerSettings,
  fetchTimerSettings,
  updateTimerSettings,
} from "../appwrite backend/db";
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
  startedAt: null, // new Date()
  secsCompletedAtPause: 0,
};

export const useTimerStore = create(
  devtools(
    (set, get) => ({
      ...initialTimerSettings,
      secondsRemaining: initialTimerSettings[initialTimerSettings.mode] * 60,

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
        const state = get();
        const startedState = {
          status: "started",
          startedAt: new Date(),
        };

        set(() => startedState);

        //db
        updateTimerSettings(state.$id, {
          ...startedState,
          startedAt: startedState.startedAt.toISOString(),
        });
      },

      setCountdown: (secondsRemaining) => {
        set(() => ({
          secondsRemaining: secondsRemaining,
        }));
      },

      pauseTimer: () => {
        const state = get();
        const secsCompletedAtPause =
          state[state.mode] * 60 - state.secondsRemaining;
        const pausedState = {
          status: "paused",
          startedAt: null,
          secsCompletedAtPause: secsCompletedAtPause,
        };
        set(() => pausedState);

        //db
        updateTimerSettings(state.$id, pausedState);
      },

      finishPomodoro: () => {
        const state = get();
        const completedPomodoros = state.completedPomodoros + 1;
        const nextMode =
          completedPomodoros % state.longBreakInterval === 0
            ? "longBreak"
            : "shortBreak";
        const secondsRemaining = state[nextMode] * 60;
        const finishedPomodoroState = {
          completedPomodoros: completedPomodoros,
          mode: nextMode,
          status: "initial",
          startedAt: null,
          secsCompletedAtPause: 0,
        };
        set(() => ({
          ...finishedPomodoroState,
          secondsRemaining: secondsRemaining,
        }));

        //db
        updateTimerSettings(state.$id, finishedPomodoroState);

        sendNotification(`Time to take a ${nextMode.split("B")[0]} break!`);
      },

      finishBreak: () => {
        const state = get();
        const nextMode = "pomodoro";
        const secondsRemaining = state[nextMode] * 60;
        const finishedBreakState = {
          mode: nextMode,
          status: "initial",
          startedAt: null,
          secsCompletedAtPause: 0,
        };
        set({
          ...finishedBreakState,
          secondsRemaining: secondsRemaining,
        });
        //db
        updateTimerSettings(state.$id, finishedBreakState);
        sendNotification("Time to Focus!");
      },

      saveSettings: (timerSettings) => {
        const state = get();
        let secsCompletedAtPause = state.secsCompletedAtPause;
        let secondsRemaining =
          state.status === "paused"
            ? timerSettings[state.mode] * 60 - state.secsCompletedAtPause
            : timerSettings[state.mode] * 60;

        if (secsCompletedAtPause && state.status === "started") {
          secondsRemaining -= state.secsCompletedAtPause;
        }

        set(() => ({
          ...timerSettings,
          secondsRemaining: secondsRemaining,
        }));

        updateTimerSettings(state.$id, {
          ...timerSettings,
        }).then(() => SettingsSavedToast());
      },

      changeMode: (btn) => {
        const state = get();
        const changeModeState = {
          mode: btn,
          status: "initial",
          secsCompletedAtPause: 0,
          startedAt: null,
        };
        set(() => ({
          ...changeModeState,
          secondsRemaining: state[btn] * 60,
        }));
        //db
        updateTimerSettings(state.$id, changeModeState);
      },
    }),
    { name: "timer store" }
  )
);
