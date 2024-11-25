/* eslint-disable react/prop-types */
import CurrentTask from "./CurrentTask";
import TaskList from "./TaskList";
import AddTask from "./AddTask";

export default function Tasks() {
  return (
    <>
      <CurrentTask />
      <TaskList />
      <AddTask />
    </>
  );
}