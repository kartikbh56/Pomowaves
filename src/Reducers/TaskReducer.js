export const initialTasksState = {
  tasks: [],
  currentTask: "",
  currentTaskDocumentID : "" // for db
};

export function tasksReducer(tasksState, action) {
  switch (action.type) {
    case "fetchTasks": // initial fetching from DB
      return {
        ...tasksState,
        tasks: action.tasks,
      };
    case "fetchCurrentTask":
      return {
        ...tasksState,
        currentTask: action.currentTask,
        currentTaskDocumentID:action.currentTaskDocumentID
      };
    case "sortTasks":
      return {
        ...tasksState,
        tasks: tasksState.tasks.slice().sort((a, b) => {
          // sorting the tasks in such a way that, completed tasks stay at the bottom and current task at the top of the list
          if (a.id === tasksState.currentTask) return -1;
          if (b.id === tasksState.currentTask) return 1;
          if (a.completed >= a.estimated && b.completed < b.estimated) return 1;
          if (b.completed >= b.estimated && a.completed < a.estimated)
            return -1;
          return 0;
        }),
      };
    case "setTasks":
      return {
        ...tasksState,
        tasks: action.tasks || tasksState.tasks,
        currentTask: action.currentTask || tasksState.currentTask,
      };
    case "switchTask":
      return { ...tasksState, currentTask: action.id };
    case "modifyTask":
      return {
        ...tasksState,
        tasks: tasksState.tasks.map((task) =>
          task.id === action.id
            ? { ...task, task: action.title, estimated: action.estimated }
            : task
        ),
      };
    case "addTask":
      return {
        ...tasksState,
        tasks: [...tasksState.tasks, action.newTask],
        currentTask: action.currentTask || tasksState.currentTask
      };
    case "deleteTask":
      return {
        ...tasksState,
        tasks: tasksState.tasks.filter((task) => task.id !== action.id),
      };
  }
}
