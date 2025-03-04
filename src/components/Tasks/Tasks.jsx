/* eslint-disable react/prop-types */
import CurrentTask from "./CurrentTask";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import { useContext, useEffect } from "react";
import { TasksContext } from "../../contexts/context";
import { fetchTasks, fetchCurrentTask } from "../../appwrite backend/db";

export default function Tasks() {
  const { dispatchTasks } = useContext(TasksContext);

  useEffect(() => {
    fetchTasks().then((data) =>
      dispatchTasks({ type: "fetchTasks", tasks: data })
    );

    dispatchTasks({ type: "sortTasks" });

    fetchCurrentTask().then((currentTask) => {
      dispatchTasks({
        type: "fetchCurrentTask",
        currentTask: currentTask?.currentTaskId || "",
        currentTaskDocumentID: currentTask?.$id || "",
      });
    });
  }, []);

  return (
    <>
      <CurrentTask />
      <TaskList />
      <AddTask />
    </>
  );
}
