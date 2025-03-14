/* eslint-disable react/prop-types */
import { useState } from "react";
import { DeleteTaskToast, UpdateTaskToast } from "../Toast";
import { useTasksStore } from "../../store/useTasksStore";
export default function TodoItemSettings({ toggleOptions, todo }) {
  const [options, setOptions] = useState({
    taskTitle: todo.task,
    estimated: todo.estimated,
  });
  const { taskTitle, estimated } = options;
  const updateTask = useTasksStore((state) => state.updateTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);

  function saveSettings() {
    if (options.taskTitle) {
      updateTask(todo.id, {
        task: options.taskTitle,
        estimated: options.estimated,
      });
      UpdateTaskToast(todo.task);
      toggleOptions();
    }
  }

  function deleteCurrentTask() {
    deleteTask(todo.id || todo.$id);
    DeleteTaskToast(todo.task);
  }
  return (
    <div className="modalview" onClick={toggleOptions}>
      <div
        className="todo-item"
        style={{ width: "500px", padding: "15px", transform: "none" }}
        onKeyDown={(e) => e.key === "Enter" && saveSettings()}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          className="menu-container-header-input"
          value={taskTitle}
          onChange={(e) =>
            setOptions({ ...options, taskTitle: e.target.value })
          }
          autoFocus={true}
        />
        <div>
          <div className="todo-label">Completed / Estimated Pomodoros</div>
          <div className="pomodoro-inputs">
            <div
              className="task-settings-input"
              style={{
                opacity: "0.7",
                fontWeight: 800,
                padding: "7px",
                cursor: "no-drop",
              }}
            >
              {todo.completed}
            </div>
            <span> / </span>
            <input
              className="task-settings-input"
              type="number"
              id="estimated"
              value={estimated}
              min={todo.completed}
              onChange={(e) =>
                setOptions({
                  ...options,
                  estimated:
                    Number(e.target.value) >= todo.completed
                      ? Number(e.target.value)
                      : options.estimated,
                })
              }
            />
            <button
              className="up-down-btn"
              onClick={() =>
                setOptions({ ...options, estimated: options.estimated + 1 })
              }
            >
              <img src="icons/caret-up.png" />
            </button>
            <button
              className="up-down-btn"
              onClick={() =>
                setOptions({
                  ...options,
                  estimated:
                    options.estimated - 1 >= todo.completed &&
                    options.estimated - 1 >= 1
                      ? options.estimated - 1
                      : options.estimated,
                })
              }
            >
              <img src="icons/caret-down.png" />
            </button>
          </div>
          <div className="form-actions">
            <div>
              <button
                type="button"
                className="delete-button"
                onClick={deleteCurrentTask}
              >
                Delete
              </button>
            </div>
            <div>
              <button
                type="button"
                className="cancel-button"
                onClick={toggleOptions}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button"
                onClick={saveSettings}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
