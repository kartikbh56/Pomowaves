/* eslint-disable react/prop-types */
import { useContext } from "react";
import { TasksContext } from "../Contexts/Context";
export default function Todo({ todo, handleClick, toggleOptions }) {
    const {
      tasksState: { currentTask },
    } = useContext(TasksContext);
    const { task, completed, estimated, id } = todo;
    const selectedState = currentTask === id;
    const taskProgress = (completed * 100) / estimated;
  
    return (
      <div
        className={`todo-item ${selectedState ? "task-selected" : ""}`}
        onClick={handleClick}
      >
        <div
          className="todo-progress"
          style={{ width: `${taskProgress}%` }}
        ></div>
        <div className="todo-content">
          <div
            className="right-mark"
            style={
              completed >= estimated
                ? { backgroundColor: "rgb(186, 73, 73)" }
                : {}
            }
          ></div>
          <span className="title">
            {completed >= estimated ? (
              <s style={{ opacity: "0.5" }}>{task}</s>
            ) : (
              task
            )}
          </span>
          <span className="progress">
            {completed} / {estimated}
          </span>
          <div
            className="btn task-opt"
            onClick={(e) => {
              e.stopPropagation();
              toggleOptions();
            }}
          >
            <img src="icons/vertical-ellipsis.png" />
          </div>
        </div>
      </div>
    );
  }