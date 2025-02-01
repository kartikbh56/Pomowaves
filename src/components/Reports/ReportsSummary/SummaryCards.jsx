/* eslint-disable react/prop-types */

import { useContext } from "react";
import { ReportsContext } from "../../../contexts/context";

export default function SummaryCards() {
  const {
    reportsState: { hoursFocused, daysAccessed, dayStreak },
  } = useContext(ReportsContext);

  const cardsData = [
    { icon: "icons/three-o-clock-clock.png", value: hoursFocused, label: "Hours focused" },
    { icon: "icons/calandar.png", value: daysAccessed, label: "Days accessed" },
    { icon: "icons/fire.png", value: dayStreak, label: "Days streak" },
  ];

  return (
    <div className="summary-cards">
      {cardsData.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  );
}

const SummaryCard = ({ icon, value, label }) => (
    <div className="summary-card">
      <div className="summary-reports-icons">
        <img src={icon} alt={label} />
        <h2>{value}</h2>
      </div>
      <p>{label}</p>
    </div>
  );