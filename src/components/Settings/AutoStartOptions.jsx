/* eslint-disable react/prop-types */
export default function AutoStartOptions({ timerSettings, setTimerSettings }) {
  const autoStart = [
    {
      name: "Breaks",
      preset: timerSettings.autoStartBreaks,
      onToggle: () => setTimerSettings({
        ...timerSettings,
        autoStartBreaks: !timerSettings.autoStartBreaks,
      }),
    },
    {
      name: "Pomodoros",
      preset: timerSettings.autoStartPomodoros,
      onToggle: () => setTimerSettings({
        ...timerSettings,
        autoStartPomodoros: !timerSettings.autoStartPomodoros,
      }),
    },
  ];
  return (
    <>
      {autoStart.map((a, i) => (
        <div className="autoStartOption" key={a.name}>
          <div>
            Auto Start {a.name}
          </div>
          <div>
            <div className="container">
              <input
                type="checkbox"
                className="checkbox"
                id={`checkbox${i}`}
                checked={a.preset}
                onChange={a.onToggle}
              />
              <label className="switch" htmlFor={`checkbox${i}`}>
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
