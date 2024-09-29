/* eslint-disable react/prop-types */
import { TasksContext } from "../Contexts/Context";
import { useContext,useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function AddTaskMenu({ setAddOption }) {
    const {dispatchTasks} = useContext(TasksContext)
    const [newTask, setNewTask] = useState({ task: "", estimated: 1 });
    function saveSettings() {
      newTask.task &&
        dispatchTasks({
          type: "addTask",
          newTask: { ...newTask, completed: 0, id: uuidv4() },
        });
      setNewTask({ task: "", estimated: 1 });
    }
    return (
      <div
        className="menu-container"
        onKeyDown={(e) => e.key === "Enter" && saveSettings()}
      >
        <input
          className="menu-container-header-input"
          placeholder="What are you working on?"
          autoFocus={true}
          value={newTask.task}
          onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
        />
        <div className="todo-label">Estimated Pomodoros</div>
        <input
          className="task-settings-input"
          type="number"
          value={newTask.estimated}
          min={1}
          onChange={(e) =>
            setNewTask({ ...newTask, estimated: Number(e.target.value) })
          }
        />
        <button
          className="up-down-btn"
          onClick={() =>
            setNewTask({ ...newTask, estimated: newTask.estimated + 1 })
          }
        >
          <img src="icons/caret-up.png" />
        </button>
        <button
          className="up-down-btn"
          onClick={() =>
            setNewTask({
              ...newTask,
              estimated:
                newTask.estimated - 1 >= 1 ? Number(newTask.estimated - 1) : 1,
            })
          }
        >
          <img src="icons/caret-down.png" />
        </button>
        <div className="form-actions" style={{ flexDirection: "row-reverse" }}>
          <div>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setAddOption(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              onClick={() => saveSettings()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }