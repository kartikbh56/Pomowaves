import { useContext } from "react";
import { TasksContext } from "../../contexts/context";
import TodoItem from "./TodoItem";
import { updateCurrentTask } from "../../api/db";
export default function TaskMenu() {
  const {
    tasksState: { tasks, currentTaskDocumentID },
    dispatchTasks,
  } = useContext(TasksContext);
  function switchTask(id) {
    dispatchTasks({ type: "switchTask", id: id });
    updateCurrentTask(currentTaskDocumentID, id);
  }
  return (
    <div className="todo-container">
      {tasks.map((t) => (
        <TodoItem todo={t} key={t.id} handleClick={() => switchTask(t.id)} />
      ))}
    </div>
  );
}
