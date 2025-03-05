/* eslint-disable react/prop-types */

import CountdownContextProvider from "./CountdownContext";
import IsOpenContextProvider from "./IsOpenContextProvider";
import ReportsContextProvider from "./ReportsContextProvider";
import TasksContextProvider from "./TasksContextProvider";
import TimerContextProvider from "./TimerContextProvider";
import UserContextProvider from "./UserContextProvider";

export function ContextProvider({ children }) {
  return (
    <UserContextProvider>
      <CountdownContextProvider>
        <TimerContextProvider>
          <TasksContextProvider>
            <IsOpenContextProvider>
              <ReportsContextProvider>{children}</ReportsContextProvider>
            </IsOpenContextProvider>
          </TasksContextProvider>
        </TimerContextProvider>
      </CountdownContextProvider>
    </UserContextProvider>
  );
}
