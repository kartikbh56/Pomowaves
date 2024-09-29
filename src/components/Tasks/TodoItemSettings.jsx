/* eslint-disable react/prop-types */
import { useState,useContext } from "react";
import { TasksContext } from "../Contexts/Context";
export default function TodoItemSettings({ toggleOptions, todo }) {
    const [options, setOptions] = useState({
      taskTitle: todo.task,
      estimated: todo.estimated,
    });
    const { taskTitle, estimated } = options;
    const { dispatchTasks } = useContext(TasksContext);
    function saveSettings() {
      if (options.taskTitle) {
        dispatchTasks({
          type: "modifyTask",
          id: todo.id,
          title: options.taskTitle,
          estimated: options.estimated,
        });
        toggleOptions();
      }
    }
    return (
      <div
        className="menu-container"
        onKeyDown={(e) => e.key === "Enter" && saveSettings()}
      >
        <input
          className="menu-container-header-input"
          value={taskTitle}
          onChange={(e) => setOptions({ ...options, taskTitle: e.target.value })}
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
                onClick={() => dispatchTasks({ type: "deleteTask", id: todo.id })}
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
    );
  }
  