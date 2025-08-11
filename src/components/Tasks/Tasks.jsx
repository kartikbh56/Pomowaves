import TasksTable from "./TasksTable";
import Header from "./Header";
import Stats from "./Stats";

export default function Tasks() {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-6">
      <Header />
      <TasksTable />
      <Stats />
    </div>
  );
}
