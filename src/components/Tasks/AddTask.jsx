/* eslint-disable react/prop-types */
import { useState } from "react";
import AddTaskMenu from "./AddTaskMenu";
import { IoIosAddCircle } from "react-icons/io";

export default function AddTask() {
    const [addOption, setAddOption] = useState(false);
    return (
      <>
        {addOption ? (
          <AddTaskMenu setAddOption={setAddOption} />
        ) : (
          <div className="add-task" onClick={() => setAddOption(true)}>
            <IoIosAddCircle size={25} style={{margin:"5px"}}/>
            Add Task
          </div>
        )}
      </>
    );
  }
 