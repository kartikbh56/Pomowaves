/* eslint-disable react/prop-types */
import TodoItemSettings from "./TodoItemSettings"
import Todo from "./Todo"
import { useState } from "react";

export default function TodoItem({ todo, handleClick }) {
    const [optionsView, setOptionsView] = useState(false);
    function toggleOptions() {
      setOptionsView(!optionsView);
    }
    return (
      <>
        {optionsView ? (
          <TodoItemSettings toggleOptions={toggleOptions} todo={todo} />
        ) : (
          <Todo
            todo={todo}
            handleClick={handleClick}
            toggleOptions={toggleOptions}
          />
        )}
      </>
    );
  }