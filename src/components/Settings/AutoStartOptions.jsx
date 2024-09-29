/* eslint-disable react/prop-types */
export default function AutoStartOptions({
    autoStartBreaks,
    autoStartPomodoros,
    setAutoStartBreaks,
    setAutoStartPomodoros,
  }) {
    const autoStart = [
      { name: "Breaks", preset: autoStartBreaks, onToggle: setAutoStartBreaks },
      {
        name: "Pomodoros",
        preset: autoStartPomodoros,
        onToggle: setAutoStartPomodoros,
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
                  onChange={() => {
                    a.onToggle(!a.preset);
                  }}
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