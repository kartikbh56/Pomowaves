/* eslint-disable react/prop-types */
import { SlOptionsVertical } from "react-icons/sl";
import { useTasksStore } from "../../store/useTasksStore";

export default function Todo({ todo, handleClick, toggleOptions }) {
  const currentTask = useTasksStore((state) => state.currentTask);
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
          <SlOptionsVertical
            size={12}
            style={{ color: "rgba(0, 0, 0, 0.65)" }}
          />
        </div>
      </div>
    </div>
  );
}
