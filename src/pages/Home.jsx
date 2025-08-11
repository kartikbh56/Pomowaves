/* eslint-disable react/prop-types */
import Timer from "../components/Timer/Timer";
import Tasks from "../components/Tasks/Tasks";
export default function Home() {
  return (
    <ResponsiveLayout>
      <Timer />
      <Tasks />
    </ResponsiveLayout>
  );
}

// Layout Component to handle responsive rendering
function ResponsiveLayout({ children }) {
  return (
    <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-y-0 lg:gap-x-10 xl:gap-x-8 min-h-[calc(100vh-8rem)] items-center">
        {children.map((child, index) => (
          <div key={index} className="w-full flex flex-col">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
