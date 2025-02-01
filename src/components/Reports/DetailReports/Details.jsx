/* eslint-disable react/prop-types */
import { useState } from "react";
import { useContext } from "react";
import { ReportsContext } from "../../../contexts/context";


// at the top of this component you need to have a filtering functionality for users to filter through the date at which the tasks to be fetched
const TimeTracker = () => {
  const {
    reportsState: { timeLine },
    dispatchReports,
  } = useContext(ReportsContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(timeLine.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = timeLine.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDelete = (id) => {
    const updatedEntries = timeLine.filter((item) => item.id !== id);
    dispatchReports({ type: "deleteEntry", timeLine: updatedEntries });
  };

  return (
    <div className="time-tracker">
      <div className="header">
        <div>DATE</div>
        <div>TASK</div>
        <div>MINUTES</div>
        <div></div>
      </div>
      {currentEntries.map((entry) => (
        <TimeEntry
          key={entry.id}
          entry={entry}
          onDelete={() => handleDelete(entry.id)}
        />
      ))}
      {totalPages > 1 && (
        <div className="pagination">
          {currentPage > 1 && (
            <button className="prev up-down-btn" onClick={handlePrevious}>
              <img className="img" src="icons/left-arrow.png" alt="next" />
            </button>
          )}
          <span className="page-number">{currentPage}</span>
          {currentPage !== totalPages && (
            <button className="next up-down-btn" onClick={handleNext}>
              <img className="img" src="icons/right-arrow.png" alt="next" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

function TimeEntry({ entry, onDelete }) {
  const { task, startedAt, endedAt } = entry;
  const date = new Date(endedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeRange = `${new Date(startedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} - ${new Date(endedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;

  const minutes = Math.round((endedAt - startedAt) / (1000 * 60));
  return (
    <div className="entry">
      <div>
        <div className="date">{date}</div>
        <div className="time-range">{timeRange}</div>
      </div>
      <div>
        <span className="project-name">{task}</span>
      </div>
      <div className="minutes">{minutes}</div>
      <div className="delete-icon" onClick={onDelete}>
        <Trash2 size={18} color="#888" style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
}

export default TimeTracker;

const Trash2 = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="#808080" // Grey color
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);