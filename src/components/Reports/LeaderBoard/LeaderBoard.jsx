/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { fetchleaderboardEntries } from "../../../api/db";
export default function LeaderBoard() {
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchleaderboardEntries().then((data) => {
      setLeaderboardEntries(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div className="time-tracker-container">
      {/* Fixed Header */}
      <div
        className="header"
        style={{ gridTemplateColumns: "1fr 1fr 1fr", justifyItems: "center" }}
      >
        <div>RANK</div>
        <div>USERS</div>
        <div>DURATION</div>
      </div>

      <div className="table-body">
        {leaderboardEntries.length > 0 ? (
          <>
            {leaderboardEntries.map((entry, i) => (
              <LeaderBoardEntry
                key={entry.$id || entry.id}
                entry={entry}
                rank={i + 1}
              />
            ))}
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

function LeaderBoardEntry({ entry, rank }) {
  const hours = Math.floor(entry.minutesFocused / 60);
  const minutes = entry.minutesFocused % 60;
  return (
    <div
      className="entry"
      style={{ gridTemplateColumns: "1fr 1fr 1fr", justifyItems: "center" }}
    >
      <div>{rank}</div>
      <div>
        <span className="project-name">{entry.name}</span>
      </div>
      <div className="minutes">{hours + "h " + minutes + "m"}</div>
    </div>
  );
}
