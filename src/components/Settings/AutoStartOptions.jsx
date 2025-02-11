/* eslint-disable react/prop-types */
export default function AutoStartOptions({ userTimers, setUserTimers }) {
  const autoStart = [
    {
      name: "Breaks",
      preset: userTimers.autoStartBreaks,
      onToggle: () => setUserTimers({
        ...userTimers,
        autoStartBreaks: !userTimers.autoStartBreaks,
      }),
    },
    {
      name: "Pomodoros",
      preset: userTimers.autoStartPomodoros,
      onToggle: () => setUserTimers({
        ...userTimers,
        autoStartPomodoros: !userTimers.autoStartPomodoros,
      }),
    },
  ];
  return (
    <>
      {autoStart.map((a, i) => (
        <div className="autoStartOption" key={a.name}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: a.name === "Pomodoros" ? "56%" : "47%",
            }}
          >
            Auto Start {a.name}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "22%",
            }}
          >
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
