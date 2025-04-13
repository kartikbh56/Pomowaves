import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  addTimeLine,
  addUserToLeaderboard,
  createReport,
  deleteTimeline,
  fetchReports,
  fetchTimeline,
  getUserFromLeaderboard,
  initialFetchTimeline,
  updateLeaderboardProgress,
  updateReport,
} from "../appwrite backend/db";
import {
  AddTimelineToast,
  DeleteTimelineToast,
  StreakToast,
} from "../components/Toast";
import { formatMinutes, getMinutes } from "../utils/formatDate";

export const useReportsStore = create(
  devtools(
    (set, get) => ({
      minutesFocused: 0, // total hours focused
      daysAccessed: 1, // fetched from the DB
      dayStreak: 1, // fetched from the DB
      timeLine: [], //fetched from the DB and updated from client side as well as in the DB
      totalDocs: 0,
      leaderBoardUserDocumentId: null,

      initReports: async () => {
        const initialReports = get();
        const data = await fetchReports();

        if (!data) {
          // if there is no reports document for the user (new user), create one.
          const reports = await createReport({
            minutesFocused: initialReports.minutesFocused,
            daysAccessed: initialReports.daysAccessed,
            dayStreak: initialReports.dayStreak,
            lastAccessed: new Date().toISOString(),
          });
          set({
            ...reports,
            lastAccessed: new Date(reports.lastAccessed),
          });
        } else {
          // if already exists
          const today = new Date();
          const lastAccessed = new Date(data.lastAccessed || new Date());
          const minutesFocused = data.minutesFocused;
          set({ minutesFocused: minutesFocused });

          let streak = data.dayStreak;
          let daysAccessed = data.daysAccessed;

          // this is calculated next day of lastAccessed day, if this day is equal to the current day, then increment the streak.
          const nextDay = new Date(
            lastAccessed.getFullYear(),
            lastAccessed.getMonth(),
            lastAccessed.getDate() + 1
          );

          if (nextDay.toDateString() === today.toDateString()) {
            streak = streak + 1;
            StreakToast(streak);
          } else if (
            Math.floor((today - lastAccessed) / (1000 * 60 * 60)) > 24
          ) {
            streak = 1; // reset the streak if lastAccessed is more than 24 hours ago
            StreakToast(streak);
          }

          daysAccessed =
            lastAccessed.getDate() !== today.getDate()
              ? daysAccessed + 1
              : daysAccessed;

          const updatedReports = await updateReport(data.$id, {
            dayStreak: streak,
            daysAccessed: daysAccessed,
            lastAccessed: new Date().toISOString(),
          });

          set({
            ...updatedReports,
            lastAccessed: new Date(updatedReports.lastAccessed),
          });
        }
      },

      initTimeline: async () => {
        const timeLine = await initialFetchTimeline(20);
        set({
          timeLine: timeLine.documents.map((r) => ({
            ...r,
            startedAt: new Date(r.startedAt),
            endedAt: new Date(r.endedAt),
          })),
          totalDocs: timeLine.total,
        });
      },

      initLeaderBoard: async (currentUser) => {
        let { leaderBoardUserDocumentId } = get();
        const data = await getUserFromLeaderboard(currentUser.$id);

        if (!data.length) {
          const data = await addUserToLeaderboard(
            currentUser.$id,
            currentUser.name
          );
          leaderBoardUserDocumentId = data.$id;
        } else {
          leaderBoardUserDocumentId = data[0].$id;
        }
        set({ leaderBoardUserDocumentId: leaderBoardUserDocumentId });
      },

      addTimeLine: async (currentTaskName, startedAt, endedAt) => {
        const { minutesFocused, $id, leaderBoardUserDocumentId, timeLine } =
          get();

        const report = {
          id: crypto.randomUUID(),
          task: currentTaskName || "No Task",
          startedAt: new Date(startedAt),
          endedAt: new Date(endedAt),
        };

        report.startedAt &&
          addTimeLine({
            ...report,
            startedAt: report.startedAt.toISOString(),
            endedAt: report.endedAt.toISOString(),
          }).then(() =>
            AddTimelineToast(
              report.task,
              formatMinutes(getMinutes(report.startedAt, report.endedAt))
            )
          );

        const minutes =
          Math.round((report.endedAt - report.startedAt) / (1000 * 60)) +
          minutesFocused;

        const data = await updateReport($id, { minutesFocused: minutes });
        set({
          minutesFocused: data.minutesFocused,
          timeLine: [report, ...timeLine],
        });

        updateLeaderboardProgress(leaderBoardUserDocumentId, {
          minutesFocused: minutes,
        });
      },

      deleteTimeline: async (entry) => {
        const { timeLine, minutesFocused, $id, leaderBoardUserDocumentId } =
          get();
        const updatedEntries = timeLine.filter(
          (item) => (item.$id || item.id) !== (entry.id || entry.$id)
        );
        set({
          timeLine: updatedEntries,
        });
        DeleteTimelineToast(entry.task);

        const minutes =
          minutesFocused - getMinutes(entry.startedAt, entry.endedAt);

        deleteTimeline(entry.id || entry.$id);
        const data = await updateReport($id, { minutesFocused: minutes });

        updateLeaderboardProgress(leaderBoardUserDocumentId, {
          minutesFocused: minutes,
        });

        set({
          minutesFocused: data.minutesFocused,
        });
      },

      fetchMoreTimelineEntries: async () => {
        const { timeLine, totalDocs } = get();
        const lastId = timeLine[timeLine.length - 1].$id;
        const limit = 20;
        let moreEntries = [];
        if (timeLine.length < totalDocs) {
          const data = await fetchTimeline(limit, lastId);
          moreEntries = data.documents.map((d) => ({
            ...d,
            startedAt: new Date(d.startedAt),
            endedAt: new Date(d.endedAt),
          }));
        }
        set((state) => ({ timeLine: [...state.timeLine, ...moreEntries] }));
      },
    }),
    { name: "reports store" }
  )
);
