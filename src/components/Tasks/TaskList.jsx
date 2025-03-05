/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import TaskMenu from "./TaskMenu";
// import { TasksContext } from "../../contexts/context";
import { TasksContext } from "../../contexts/TasksContextProvider";
import Progress from "../Progress";
import { FaTrash, FaList, FaCheck } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { deleteTask, updateCurrentTask, updateTask } from "../../appwrite backend/db";
import {
  DeleteTaskToast,
  UpdateTaskToast,
} from "../Toast";

export default function TaskList() {
  const {
    tasksState: { tasks },
  } = useContext(TasksContext);

  const [options, setOptions] = useState(false);

  const totalPomodoros = tasks.reduce(
    (acc, cur) => ({
      estimated: acc.estimated + cur.estimated,
      completed: acc.completed + cur.completed,
    }),
    { estimated: 0, completed: 0 }
  );

  const overallTasksProgress = totalPomodoros.estimated
    ? (totalPomodoros.completed * 100) / totalPomodoros.estimated
    : 0;

  const toggleOptions = () => setOptions(!options);

  return (
    <div className="task-container">
      <div className="tasks-heading">
        <div>Tasks</div>
        <button className="btn btn-options" onClick={toggleOptions}>
          {/* <img src="icons/options.png"></img> */}
          <SlOptionsVertical style={{ color: "white" }} />
        </button>
      </div>
      <Progress percentage={Math.round(overallTasksProgress)} />
      {options && <Menu toggleOptions={toggleOptions} />}
      <TaskMenu />
    </div>
  );
}

function Menu({ toggleOptions }) {
  const {
    tasksState: { tasks, currentTask, currentTaskDocumentID },
    dispatchTasks,
  } = useContext(TasksContext);

  function resetTasksProgress() {
    toggleOptions();
    tasks.forEach((task) => {
      updateTask(task.$id, { completed: 0 }).then((data) => {
        dispatchTasks({ type: "reset_task_progress", $id: data.$id });
        UpdateTaskToast(task.task);
      });
    });
  }

  function clearAllTasks() {
    toggleOptions();
    tasks.forEach((task) => {
      deleteTask(task.$id || task.id).then(() => {
        dispatchTasks({ type: "deleteTask", id: task.$id || task.id });
        DeleteTaskToast(task.task);
      });
    });
  }

  function clearFinishedTasks() {
    toggleOptions();
    tasks.forEach((task) => {
      if (task.completed >= task.estimated) {
        if (task.$id === currentTask) {
          const currentTaskIndex = tasks.findIndex((t) => t.id === currentTask);
          const nextCurrentTask =
            tasks.length <= 1
              ? ""
              : tasks[currentTaskIndex + 1] ||
                tasks[currentTask - 1] ||
                tasks[0];
          // console.log({ currentTaskDocumentID, currentTaskIndex, nextCurrentTask });
          updateCurrentTask(
            currentTaskDocumentID,
            nextCurrentTask?.id || ""
          )
          dispatchTasks({ type: "switchTask", id: nextCurrentTask?.id });
        }
        deleteTask(task.$id || task.id).then(() => {
          dispatchTasks({ type: "deleteTask", id: task.$id || task.id });
          DeleteTaskToast(task.task);
        });
      }
    });
  }
  const menuItems = [
    {
      icon: <FaList />,
      text: "Reset tasks Progress",
      onClick: resetTasksProgress,
    },
    {
      icon: <FaCheck />,
      text: "Clear finished tasks",
      onClick: clearFinishedTasks,
    },
    { icon: <FaTrash />, text: "Clear all tasks", onClick: clearAllTasks },
  ];
  return (
    <div className="menu">
      {menuItems.map((item, index) => (
        <div key={index} className="menu-item" onClick={item.onClick}>
          <span className="icon">{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
