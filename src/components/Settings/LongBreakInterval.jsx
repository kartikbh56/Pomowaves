/* eslint-disable react/prop-types */
export default function LongBreakInterval({ userTimers, setUserTimers }) {
    return (
      <div className="autoStartOption">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
          }}
        >
          Long Break Interval
        </div>
        <div
          className="settings-input"
          style={{ width: "30%", marginBottom: "0px" }}
        >
          <input
            type="number"
            min={2}
            value={userTimers.longBreakInterval}
            onChange={(e) =>
              setUserTimers({
                ...userTimers,
                longBreakInterval: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
    );
  }