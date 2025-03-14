/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import SummaryView from "./ReportsSummary/SummaryView";
import TimeLineDetails from "./DetailReports/Details";
import LeaderBoard from "./LeaderBoard/LeaderBoard";
import ReportsContainer from "./ReportsContainer";
import { useIsOpenStore } from "../../store/useIsOpenStore";

export default function ReportsMenu() {
  const [currentView, setCurrentView] = useState("Summary");
  const toggleMenu = useIsOpenStore((state) => state.toggleMenu);
  const closeReports = () => toggleMenu("reports");
  
  return (
    <ReportsContainer closeReports={closeReports}>
      <img
        className="close-button"
        style={{ padding: "0px" }}
        src="icons/close.png"
        onClick={closeReports}
      />
      <ReportsTabs setCurrentView={setCurrentView} currentView={currentView} />
      {currentView === "Summary" && <SummaryView />}
      {currentView === "Details" && <TimeLineDetails />}
      {currentView === "Leaderboard" && <LeaderBoard />}
    </ReportsContainer>
  );
}

function ReportsTabs({ currentView, setCurrentView }) {
  const views = ["Summary", "Details", "Leaderboard"].map((view) => (
    <button
      key={view}
      className={`tab ${view === currentView ? "active" : ""}`}
      onClick={() => setCurrentView(view)}
    >
      {view}
    </button>
  ));
  return <div className="tabs">{views}</div>;
}
