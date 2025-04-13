/* eslint-disable react/prop-types */
export default function LongBreakInterval({ timerSettings, setTimerSettings }) {
  return (
    <div className="autoStartOption">
      <div>Long Break Interval</div>
      <div
        className="settings-input"
        style={{ margin: "0", width: "20%", padding: "0px" }}
      >
        <input
          type="number"
          min={2}
          value={timerSettings.longBreakInterval}
          onChange={(e) => {
            const longBreakInterval = Number(e.target.value);
            longBreakInterval >= 2 &&
              setTimerSettings({
                ...timerSettings,
                longBreakInterval: longBreakInterval,
              });
          }}
        />
      </div>
    </div>
  );
}
