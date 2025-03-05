/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from "react";
import { initialReports, reportsReducer } from "../Reducers/ReportsReducer";
import {
  addUserToLeaderboard,
  createReport,
  fetchReports,
  getUserFromLeaderboard,
  initialFetchTimeline,
  updateReport,
} from "../appwrite backend/db";
import { StreakToast } from "../components/Toast";
import { UserContext } from "./UserContextProvider";

export const ReportsContext = createContext(null);

export default function ReportsContextProvider({ children }) {
  const { user } = useContext(UserContext);
  useEffect(() => {
    initialFetchTimeline(8).then((data) => {
      dispatchReports({
        type: "fetchReports",
        reports: data.documents.map((r) => ({
          ...r,
          startedAt: new Date(r.startedAt),
          endedAt: new Date(r.endedAt),
        })),
        totalDocs: data.total,
      });
    });

    getUserFromLeaderboard(user?.$id).then((data) => {
      // console.log("leaderboard data", data)
      if (!data.length) {
        console.log("adding user to leaderboard");
        addUserToLeaderboard(user.$id, user.name).then((data) => {
          dispatchReports({
            type: "leadboardUserDocId",
            leaderBoardUserDocumentId: data.$id,
          });
        });
      }
      dispatchReports({
        type: "leadboardUserDocId",
        leaderBoardUserDocumentId: data[0]?.$id,
      });
    });

    fetchReports().then((data) => {
      // console.log("this is what got for you", data);
      if (!data?.$id) {
        // if there's no document in the collection.
        // create one for the user and update the states
        const reports = {
          minutesFocused: reportsState.minutesFocused,
          daysAccessed: reportsState.daysAccessed,
          dayStreak: reportsState.dayStreak,
          lastAccessed: new Date().toISOString(),
        };
        createReport(reports).then((data) => {
          StreakToast(data.daysStreak);
          dispatchReports({
            type: "initialFetchSummary",
            report: { data, lastAccessed: new Date(data.lastAccessed) },
          });
        });
      } else {
        // if already exists

        const today = new Date();
        const lastAccessed = new Date(data.lastAccessed || new Date());

        let streak = data.dayStreak;
        let daysAccessed = data.daysAccessed;

        // this is calculated next day of lastAccessed day, if this day is equal to the current day, then increment the streak.
        const nextDay = new Date(
          lastAccessed.getFullYear(),
          lastAccessed.getMonth(),
          lastAccessed.getDate() + 1
        );

        // console.log(
        //   "%c last accessed",
        //   "color:red;",
        //   lastAccessed.toDateString()
        // );
        if (nextDay.toDateString() === today.toDateString()) {
          streak = streak + 1;
          StreakToast(streak);
        } else if (Math.floor((today - lastAccessed) / (1000 * 60 * 60)) > 24) {
          streak = 1; // reset the streak if lastAccessed is more than 24 hours ago
          StreakToast(streak);
        }

        daysAccessed =
          lastAccessed.getDate() !== today.getDate()
            ? daysAccessed + 1
            : daysAccessed;

        // console.log("Updated daysAccessed and dayStreak",{daysAccessed,streak})
        updateReport(data.$id, {
          dayStreak: streak,
          daysAccessed: daysAccessed,
          lastAccessed: new Date().toISOString(),
        }).then((data) => {
          console.log("%c updated reports", "color:yellow;", data);
          dispatchReports({
            type: "initialFetchSummary",
            report: { ...data, lastAccessed: new Date(data.lastAccessed) },
          });
        });
      }
    });
  }, []);
  const [reportsState, dispatchReports] = useReducer(
    reportsReducer,
    initialReports
  );
  return (
    <ReportsContext.Provider value={{ reportsState, dispatchReports }}>
      {children}
    </ReportsContext.Provider>
  );
}
