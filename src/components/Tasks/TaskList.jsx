/* eslint-disable react/prop-types */
import { useContext } from "react";
import TaskMenu from "./TaskMenu"
import { TasksContext } from "../Contexts/Context";
import Progress from "../Progress";
export default function TaskList() {
  const {
    tasksState: { tasks },
  } = useContext(TasksContext);

  const overallTasksProgress = tasks.reduce(function (acc, cur) {
    const progress = (cur.completed * 100) / cur.estimated;
    return acc + progress / tasks.length;
  }, 0);

  return (
    <div className="task-container">
      <div className="tasks-heading">
        <div>Tasks</div>
        <button className="btn btn-options">
          <img src="icons/options.png"></img>
        </button>
      </div>
      <Progress percentage={Math.round(overallTasksProgress)} />
      <TaskMenu />
    </div>
  );
}
