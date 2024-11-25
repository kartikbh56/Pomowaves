/* eslint-disable react/prop-types */
import { useState } from "react";
import AddTaskMenu from "./AddTaskMenu";

export default function AddTask() {
    const [addOption, setAddOption] = useState(false);
    return (
      <>
        {addOption ? (
          <AddTaskMenu setAddOption={setAddOption} />
        ) : (
          <div className="add-task" onClick={() => setAddOption(true)}>
            <img src="icons/add.png" />
            Add Task
          </div>
        )}
      </>
    );
  }
 