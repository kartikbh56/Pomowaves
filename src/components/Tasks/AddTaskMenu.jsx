/* eslint-disable react/prop-types */
import { useState } from "react";
import { AddTaskToast } from "../Toast";
import { useTasksStore } from "../../store/useTasksStore";

export default function AddTaskMenu({ setAddOption }) {
  const addTask = useTasksStore((state) => state.addTask);
  const [newTaskInputFields, setNewTaskInputFields] = useState({
    task: "",
    estimated: 1,
  });
  function saveSettings() {
    if (newTaskInputFields.task) {
      const newTask = { ...newTaskInputFields, completed: 0, id: crypto.randomUUID() };
      addTask(newTask);
      AddTaskToast(newTask.task);
    }

    setNewTaskInputFields({ task: "", estimated: 1 }); // input fields states
  }
  return (
    <div
      className="menu-container"
      onKeyDown={(e) => {
        e.key === "Enter" && saveSettings();
        e.key === "Escape" && setAddOption(false);
      }}
    >
      <input
        className="menu-container-header-input"
        placeholder="What are you working on?"
        autoFocus={true}
        value={newTaskInputFields.task}
        onChange={(e) =>
          setNewTaskInputFields({ ...newTaskInputFields, task: e.target.value })
        }
      />
      <div className="todo-label">Estimated Pomodoros</div>
      <input
        className="task-settings-input"
        type="number"
        value={newTaskInputFields.estimated}
        min={1}
        onChange={(e) =>
          setNewTaskInputFields({
            ...newTaskInputFields,
            estimated: Number(e.target.value),
          })
        }
      />
      <button
        className="up-down-btn"
        onClick={() =>
          setNewTaskInputFields({
            ...newTaskInputFields,
            estimated: newTaskInputFields.estimated + 1,
          })
        }
      >
        <img src="icons/caret-up.png" />
      </button>
      <button
        className="up-down-btn"
        onClick={() =>
          setNewTaskInputFields({
            ...newTaskInputFields,
            estimated:
              newTaskInputFields.estimated - 1 >= 1
                ? Number(newTaskInputFields.estimated - 1)
                : 1,
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
