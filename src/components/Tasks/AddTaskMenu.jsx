/* eslint-disable react/prop-types */
import { TasksContext } from "../../contexts/context";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addCurrentTask, addTask, updateCurrentTask } from "../../appwrite backend/db";
import { AddTaskToast } from "../Toast";

export default function AddTaskMenu({ setAddOption }) {
  const {
    tasksState: { tasks, currentTaskDocumentID },
    dispatchTasks,
  } = useContext(TasksContext);
  const [newTaskInputFields, setNewTaskInputFields] = useState({
    task: "",
    estimated: 1,
  });
  function saveSettings() {
    if (newTaskInputFields.task) {
      const newTask = { ...newTaskInputFields, completed: 0, id: uuidv4() };

      if (tasks.length === 0) {
        // if the task list is empty, then the current task will be the one which gets added now

        dispatchTasks({ type: "switchTask", id: newTask.id }); // first task added when there were no tasks, will be the currentTask
        if (!currentTaskDocumentID) {
          // if there's no document in the collection for currentTask (for the users using this app for the first time)
          // add the currentTask document in the collection (currentTask document contains the id of one of the tasks in the task list which is marked as current task)
          // and then update the currentTask, and the created document's id for further update operations on currentTask
          addCurrentTask(newTask.id).then((newCurrentTask) => {
            // console.log("newCurrentTask", newCurrentTask);
            dispatchTasks({
              type: "fetchCurrentTask",
              currentTask: newCurrentTask?.currentTaskId,
              currentTaskDocumentID: newCurrentTask?.$id,
            });
          });

          // if currentTaskDocumentID already exists (fetched), then update it with the taskId of the task added just now.
        } else updateCurrentTask(currentTaskDocumentID, newTask.id);
      }

      dispatchTasks({
        type: "addTask",
        newTask: newTask,
      });
      //db
      addTask(newTask, newTask.id).then((data) => AddTaskToast(data.task));
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
