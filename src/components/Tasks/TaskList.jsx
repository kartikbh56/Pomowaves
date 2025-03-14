/* eslint-disable react/prop-types */
import { useState } from "react";
import TaskMenu from "./TaskMenu";
import Progress from "../Progress";
import { FaTrash, FaList, FaCheck } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { DeleteTaskToast, UpdateTaskToast } from "../Toast";
import { useTasksStore } from "../../store/useTasksStore";

export default function TaskList() {
  const tasks = useTasksStore((state) => state.tasks);

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
          <SlOptionsVertical style={{ color: "white" }} />
        </button>
      </div>
      <Progress percentage={Math.round(overallTasksProgress)} delay={3} />
      {options && <Menu toggleOptions={toggleOptions} />}
      <TaskMenu />
    </div>
  );
}

function Menu({ toggleOptions }) {
  const tasks = useTasksStore((state) => state.tasks);
  const updateTask = useTasksStore((state) => state.updateTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);

  function resetTasksProgress() {
    toggleOptions();
    tasks.forEach((task) => {
      updateTask(task.$id, { completed: 0 });
      UpdateTaskToast(task.task);
    });
  }

  function clearAllTasks() {
    toggleOptions();
    tasks.forEach((task) => {
      deleteTask(task.$id || task.id);
      DeleteTaskToast(task.task);
    });
  }

  function clearFinishedTasks() {
    toggleOptions();
    tasks.forEach((task) => {
      if (task.completed >= task.estimated) {
        deleteTask(task.$id || task.id);
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
