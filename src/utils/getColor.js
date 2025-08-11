export function getColor(mode) {
  return {
    pomodoro: "var(--pomowaves-pomodoro)",
    shortBreak: "var(--pomowaves-short-break)",
    longBreak: "var(--pomowaves-long-break)",
  }[mode];
}
