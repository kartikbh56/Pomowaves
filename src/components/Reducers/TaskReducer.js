export const initialTasksState = {
  tasks: [
    {
      id: 1,
      task: "React.js",
      estimated: 5,
      completed: 4,
    },
    {
      id: 2,
      task: "Academics",
      estimated: 5,
      completed: 4,
    },
    {
      id: 3,
      task: "Project",
      estimated: 4,
      completed: 2,
    },
    {
      id: 4,
      task: "randomTask",
      estimated: 6,
      completed: 1,
    },
    {
      id: 5,
      task: "Random Task 3",
      estimated: 4,
      completed: 3,
    },
    {
      id: 6,
      task: "Random Task 4",
      estimated: 4,
      completed: 2,
    },
    {
      id: 7,
      task: "Random Task 5",
      estimated: 4,
      completed: 1,
    },
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
          console.log("sorting");
          if (a.id === tasksState.currentTask) return -1;
          if (b.id === tasksState.currentTask) return 1;
          if (a.completed >= a.estimated && b.completed < b.estimated) return 1;
          if (b.completed >= b.estimated && a.completed < a.estimated)
            return -1;
          return 0;
        }),
      };
    case "setTasks":
      return { tasks: action.tasks, currentTask: action.currentTask };
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
