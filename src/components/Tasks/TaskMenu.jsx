import { useContext } from "react";
import { TasksContext } from "../Contexts/Context";
import TodoItem from "./TodoItem"
export default function TaskMenu() {
    const {
      tasksState: { tasks },
      dispatchTasks,
    } = useContext(TasksContext);
    return (
      <div className="todo-container">
        {tasks.map((t) => (
          <TodoItem
            todo={t}
            key={t.id}
            handleClick={() => dispatchTasks({ type: "switchTask", id: t.id })}
          />
        ))}
      </div>
    );
  }