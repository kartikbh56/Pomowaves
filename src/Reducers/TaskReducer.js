export const initialTasksState = {
  tasks: [
  ],
  currentTask: 1,
};

export function tasksReducer(tasksState, action) {
  switch (action.type) {
    case "sortTasks":
      return {
        ...tasksState,
        tasks: tasksState.tasks.slice().sort((a, b) => {
          // sorting the tasks in such a way that, completed tasks stay at the bottom and current task at the top
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
        currentTask:
          tasksState.tasks.length === 0
            ? action.newTask.id
            : tasksState.currentTask,
      };
    case "deleteTask":
      return {
        ...tasksState,
        tasks: tasksState.tasks.filter((task) => task.id !== action.id),
      };
  }
}
