import TodoItem from "./TodoItem";
import { useTasksStore } from "../../store/useTasksStore";
export default function TaskMenu() {
  const tasks = useTasksStore((state) => state.tasks);
  const updateCurrentTask = useTasksStore((state) => state.updateCurrentTask);
  function switchTask(id) {
    updateCurrentTask(id);
  }
  return (
    <div className="todo-container">
      {tasks.map((t) => (
        <TodoItem todo={t} key={t.id} handleClick={() => switchTask(t.id)} />
      ))}
    </div>
  );
}
