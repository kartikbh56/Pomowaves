import WeekView from "./timelineViews/WeekView";
import { useState } from "react";
import DayView from "./timelineViews/DayView";
import MonthView from "./timelineViews/MonthView";

export default function FocusHours() {
  const [view, setView] = useState("Day");

  const viewControls = ["Day", "Week", "Month"].map((period) => (
    <button
      key={period}
      className={`period-btn ${view === period ? "active" : ""}`}
      onClick={() => setView(period)}
    >
      {period}
    </button>
  ));

  return (
    <div className="focus-hours">
      <div className="focus-hours-header">
        <h3>Focus Hours</h3>

        <div className="period-selector">{viewControls}</div>
      </div>
      {view === "Day" && <DayView />}
      {view === "Week" && <WeekView />}
      {view === "Month" && <MonthView />}
    </div>
  );
}


