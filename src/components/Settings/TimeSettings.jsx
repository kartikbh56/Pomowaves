/* eslint-disable react/prop-types */
export default function TimeSettings({ timerSettings, setTimerSettings }) {
    const timers = [
      { name: "Pomodoro", mode: "pomodoro", value: timerSettings.pomodoro, min: 1 },
      {
        name: "Short Break",
        mode: "shortBreak",
        value: timerSettings.shortBreak,
        min: 0,
      },
      {
        name: "Long Break",
        mode: "longBreak",
        value: timerSettings.longBreak,
        min: 0,
      },
    ];
  
    return (
      <div className="time-setting">
        {timers.map((t) => (
          <div className="settings-input" key={t.mode}>
            <div>{t.name}</div>
            <input
              type="number"
              min={t.min}
              value={t.value}
              onChange={(e) =>
                setTimerSettings({
                  ...timerSettings,
                  [t.mode]: Number(e.target.value),
                })
              }
            />
          </div>
        ))}
      </div>
    );
  }