/* eslint-disable react/prop-types */
export default function TimeSettings({ userTimers, setUserTimers }) {
    const timers = [
      { name: "Pomodoro", mode: "pomodoro", value: userTimers.pomodoro, min: 1 },
      {
        name: "Short Break",
        mode: "shortBreak",
        value: userTimers.shortBreak,
        min: 0,
      },
      {
        name: "Long Break",
        mode: "longBreak",
        value: userTimers.longBreak,
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
                setUserTimers({
                  ...userTimers,
                  [t.mode]: Number(e.target.value),
                })
              }
            />
          </div>
        ))}
      </div>
    );
  }