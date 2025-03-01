/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import TaskMenu from "./TaskMenu";
import { TasksContext } from "../../contexts/context";
import Progress from "../Progress"; 
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
      {options && <Menu />}
      <TaskMenu />
    </div>
  );
}

import { FaTrash, FaList, FaCheck } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";

const menuItems = [
  { icon: <FaList />, text: "Reset tasks Progress" },
  { icon: <FaCheck />, text: "Clear finished tasks" },
  { icon: <FaTrash />, text: "Clear all tasks" },
];

const Menu = () => {
  return (
    <div className="menu">
      {menuItems.map((item, index) => (
        <div key={index} className="menu-item">
          <span className="icon">{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
};
