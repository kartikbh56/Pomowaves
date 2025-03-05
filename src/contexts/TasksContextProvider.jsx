/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";
import { initialTasksState, tasksReducer } from "../Reducers/TaskReducer";

export const TasksContext = createContext(null);

export default function TasksContextProvider({ children }) {
  const [tasksState, dispatchTasks] = useReducer(
    tasksReducer,
    initialTasksState
  );
  return (
    <TasksContext.Provider value={{ tasksState, dispatchTasks }}>
      {children}
    </TasksContext.Provider>
  );
}
