import { create } from "zustand";
import {
  addCurrentTask,
  addTask,
  deleteTask,
  fetchCurrentTask,
  fetchTasks,
  updateCurrentTask,
  updateTask,
} from "../appwrite backend/db";
import { devtools } from "zustand/middleware";

export const useTasksStore = create(
  devtools(
    (set, get) => ({
      tasks: [],
      currentTask: "",
      currentTaskDocumentID: "", // for db

      // setters
      initTasks: async () => {
        const fetchedTasks = await fetchTasks();
        let fetchedCurrentTask = await fetchCurrentTask();
        // let { currentTaskId, $id } = fetchedCurrentTask;
        let currentTaskId = fetchedCurrentTask?.currentTaskId;
        let $id = fetchedCurrentTask?.$id;
        const sortedTasks = sortTasks(fetchedTasks, currentTaskId);

        if (!fetchedCurrentTask) {
          // if there's no document in the collection for currentTask (for the users using this app for the first time)
          // add the currentTask document in the collection (currentTask document contains the id of one of the tasks in the task list which is marked as current task)
          // and update the currentTask, and the created document's id for further update operations on currentTask
          const currentTaskDoc = await addCurrentTask("");
          currentTaskId = currentTaskDoc.currentTaskId;
          $id = currentTaskDoc.$id;
        }

        if (
          !currentTaskId ||
          !fetchedTasks.find((t) => t.id === currentTaskId)
        ) {
          // if there's no currentTaskId or if the currentTaskId does not match with any of the tasks id in tasklist,
          // set the first task's id as the the currentTaskId
          currentTaskId = fetchedTasks[0]?.$id || "";
          currentTaskId && updateCurrentTask($id, currentTaskId);
        }

        set(() => ({
          tasks: sortedTasks,
          currentTask: currentTaskId,
          currentTaskDocumentID: $id,
        }));
        return;
      },

      addTask: (newTask) => {
        let { currentTaskDocumentID, currentTask, tasks } = get();

        addTask(newTask, newTask.id);

        if (!currentTask || tasks.length === 0) {
          updateCurrentTask(currentTaskDocumentID, newTask.id);
          currentTask = newTask.id;
        }

        tasks = [...tasks, newTask];

        set(() => ({
          tasks: tasks,
          currentTask: currentTask,
        }));
      },

      deleteTask: (id) => {
        let { currentTask, tasks, currentTaskDocumentID } = get();
        const newTasks = tasks.filter((t) => t.id !== id);

        if (id === currentTask) {
          const currentTaskIndex = tasks.findIndex((t) => t.id === id);
          const nextCurrentTask =
            tasks[currentTaskIndex + 1] || tasks[currentTask - 1] || tasks[0];

          updateCurrentTask(currentTaskDocumentID, nextCurrentTask?.id || "");
          currentTask = nextCurrentTask?.id || "";
        }

        set(() => ({
          tasks: newTasks,
          currentTask: currentTask,
        }));

        //db
        deleteTask(id);
      },

      updateTask: async (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));

        //db
        await updateTask(id, updates);
      },

      updateCurrentTask: async (taskId) => {
        const { currentTaskDocumentID } = get();
        set(() => ({ currentTask: taskId }));
        //db
        updateCurrentTask(currentTaskDocumentID, taskId);
      },

      sortTasks: () => {
        set((state) => ({ tasks: sortTasks(state.tasks, state.currentTask) }));
      },
    }),
    { name: "tasks store" }
  )
);

function sortTasks(tasks, currentTaskId) {
  return tasks.slice().sort((a, b) => {
    // sorting the tasks in such a way that, completed tasks stay at the bottom and current task at the top of the list
    if (a.id === currentTaskId) return -1;
    if (b.id === currentTaskId) return 1;
    if (a.completed >= a.estimated && b.completed < b.estimated) return 1;
    if (b.completed >= b.estimated && a.completed < a.estimated) return -1;
    return 0;
  });
}
