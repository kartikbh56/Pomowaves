/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from "react";
import { timerReducer, initialTimerState } from "../Reducers/TimerReducer";
import {
  createTimerSettings,
  fetchTimerSettings,
  updateTimerSettings,
} from "../appwrite backend/db";
import { CountdownContext } from "./CountdownContext";

export const TimerContext = createContext(null);

export default function TimerContextProvider({ children }) {
  const [timerState, dispatchTimerState] = useReducer(
    timerReducer,
    initialTimerState
  );
  const { dispatchCountdown } = useContext(CountdownContext);
  useEffect(() => {
    fetchTimerSettings().then((data) => {
      if (!data?.$id) {
        // if there's no document in the collection.
        // create one for the user and update the states
        createTimerSettings({
          ...timerState,
          lastAccessed: new Date().toISOString(),
        }).then((data) => {
          dispatchTimerState({
            type: "initializeTimerSettings",
            timerSettings: {
              ...data,
              startedAt: data.startedAt, // it's null because, it's being created for the first time.
              lastAccessed: new Date(data.lastAccessed),
            },
          });
        });
      } else {
        // if already exists
        // console.log(
        //   "timer settings was last accessed at ",
        //   new Date(data.lastAccessed)
        // );
        dispatchTimerState({
          type: "initializeTimerSettings",
          timerSettings: {
            ...data,
            startedAt: new Date(data.startedAt).getTime() || null,
            lastAccessed: new Date(data.lastAccessed),
            // new Date(null).getTime() is 0, so, if `startedAt` fetched form db is null, then store it as it is in the state, converting it to Date() causes inaccurate time calculations.
          },
        });
        const secondsRemaining =
          data[data.mode] * 60 - data.secsCompletedAtPause;
        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: secondsRemaining,
        });

        // reset completedPomodoros every day
        if (
          new Date(data.lastAccessed).toDateString() !==
          new Date().toDateString()
        ) {
          console.log("resetting completedPomodoros");
          updateTimerSettings(data.$id, {
            completedPomodoros: 0,
          }).then(() =>
            dispatchTimerState({
              type: "resetCompletedPomodoros",
              completedPomodoros: 0,
            })
          );
        }
        updateTimerSettings(data.$id, {
          lastAccessed: new Date().toISOString(),
        });
      }
    });
  }, []);
  return (
    <TimerContext.Provider value={{ timerState, dispatchTimerState }}>
      {children}
    </TimerContext.Provider>
  );
}
