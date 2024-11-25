import { useContext } from "react";
import { ReportsContext } from "../../contexts/context";

/* eslint-disable react/prop-types */
export default function ReportsSummary() {
  return (
    <>
      <SummaryCards />
      <div className="focus-hours">
        <div className="focus-hours-header">
          <h3>Focus Hours</h3>
          <div className="period-selector">
            <button className="period-btn active">Week</button>
            <button className="period-btn">Month</button>
            <button className="period-btn">Year</button>
          </div>
        </div>
      </div>
    </>
  );
}

function SummaryCards() {
  const {
    reportsState: { hoursFocused, daysAccessed, dayStreak },
  } = useContext(ReportsContext);
  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-reports-icons">
          <img src="icons/three-o-clock-clock.png" />
          <h2>{hoursFocused}</h2>
        </div>

        <p>hours focused</p>
      </div>

      <div className="summary-card">
        <div className="summary-reports-icons">
          <img src="icons/calandar.png" />
          <h2>{daysAccessed}</h2>
        </div>
        <p>days accessed</p>
      </div>
      <div className="summary-card">
        <div className="summary-reports-icons">
          <img src="icons/fire.png" />
          <h2>{dayStreak}</h2>
        </div>
        <p>days streak</p>
      </div>
    </div>
  );
}
