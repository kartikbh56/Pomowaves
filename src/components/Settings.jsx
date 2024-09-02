import { useState } from "react";

/* eslint-disable react/prop-types */
export default function Settings({
  dispatchTimerState,
  dispatchIsOpen,
  countdownState,
  dispatchCountdown,
  timerState,
}) {
  // console.log("Settings rendered")
  const [userTimers, setUserTimers] = useState(timerState.timers);
  function onSaveSettings() {
    const secondsRemaining =
      timerState.status === "started" || timerState.status === "paused"
        ? userTimers[timerState.mode] * 60 -
        (timerState.timers[timerState.mode] * 60 -
          countdownState.secondsRemaining)
        : userTimers[timerState.mode] * 60;
    dispatchIsOpen({ type: "toggleMenu", menu: "settings" });
    dispatchTimerState({ type: "changeTimers", timers: userTimers });
    dispatchCountdown({
      type: "setCountdown",
      secondsRemaining: secondsRemaining,
    });
  }
  return (
    <SettingsContainer onSaveSettings={onSaveSettings}>
      <TimeSettings userTimers={userTimers} setUserTimers={setUserTimers} />
      <AutoStartOptions
        autoStartBreaks={timerState.autoStartBreaks}
        autoStartPomodoros={timerState.autoStartPomodoros}
        dispatch={dispatchTimerState}
      />
      <LongBreakInterval
        userTimers={userTimers}
        setUserTimers={setUserTimers}
      />
      <Footer onSaveSettings={onSaveSettings} />
    </SettingsContainer>
  );
}

function SettingsContainer({ children, onSaveSettings }) {
  return (
    <div
      className="modalview"
      onClick={onSaveSettings}
      onKeyDown={(e) => e.key === "Enter" && onSaveSettings()}
    >
      <div className="settings-container" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">SETTINGS</div>
        <img
          className="close-button"
          src="icons/close.png"
          onClick={onSaveSettings}
        />
        <div className="settingsContent">{children}</div>
      </div>
    </div>
  );
}

function TimeSettings({ userTimers, setUserTimers }) {
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

function AutoStartOptions({ autoStartBreaks, autoStartPomodoros, dispatch }) {
  const autoStart = [
    { name: "Breaks", preset: autoStartBreaks },
    { name: "Pomodoros", preset: autoStartPomodoros },
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
                onChange={() =>
                  dispatch({
                    type: "changeAutoStart",
                    autoStart: `autoStart${a.name}`,
                  })
                }
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

function LongBreakInterval({ userTimers, setUserTimers }) {
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

function Footer({ onSaveSettings }) {
  return (
    <div className="settings-footer">
      <button className="ok-button" onClick={onSaveSettings}>
        OK
      </button>
    </div>
  );
}
