/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useContext, useReducer, useEffect } from "react";
import { IsOpenContext, ReportsContext } from "../../contexts/context";
import SummaryView from "./ReportsSummary/SummaryView";
import TimeLineDetails from "./DetailReports/Details";
import LeaderBoard from "./LeaderBoard/LeaderBoard";
import ReportsContainer from "./ReportsContainer";

export default function ReportsMenu() {

  const [currentView, setCurrentView] = useState("Summary");
  const { dispatchIsOpen } = useContext(IsOpenContext);
  const closeModal = () =>
    dispatchIsOpen({ type: "toggleMenu", menu: "reports" });
  return (
    <ReportsContainer>
      <img
        className="close-button"
        style={{ padding: "0px" }}
        src="icons/close.png"
        onClick={closeModal}
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
