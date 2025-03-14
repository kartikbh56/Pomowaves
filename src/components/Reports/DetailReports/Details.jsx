/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { useReportsStore } from "../../../store/useReportsStore";

export default function TimeTracker() {
  const timeLine = useReportsStore((state) => state.timeLine);
  const fetchMoreTimelineEntries = useReportsStore(
    (state) => state.fetchMoreTimelineEntries
  );
  const deleteTimeline = useReportsStore((state) => state.deleteTimeline);

  const [loading, setLoading] = useState(false);
  const tableBodyRef = useRef(null);

  const fetchMoreData = () => {
    setLoading(true);
    fetchMoreTimelineEntries().then(() => setLoading(false));
  };

  const handleScroll = () => {
    if (!tableBodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current;

    // Check if scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
      fetchMoreData();
    }
  };

  const handleDelete = (entry) => {
    deleteTimeline(entry);
  };

  return (
    <div className="time-tracker-container">
      {/* Fixed Header */}
      <div className="header">
        <div>DATE</div>
        <div>TASK</div>
        <div>MINUTES</div>
        <div></div>
      </div>

      {/* Scrollable Table Body */}
      <div ref={tableBodyRef} className="table-body" onScroll={handleScroll}>
        {timeLine.length > 0 ? (
          <>
            {timeLine.map((entry) => (
              <TimeEntry
                key={entry.$id || entry.id}
                entry={entry}
                onDelete={() => handleDelete(entry)}
              />
            ))}
            {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
          </>
        ) : (
          <div
            className="placeholder"
            style={{ textAlign: "center", fontSize: "13px", padding: "10px" }}
          >
            No records
          </div>
        )}
      </div>
    </div>
  );
}

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

const Trash2 = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="grey"
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
