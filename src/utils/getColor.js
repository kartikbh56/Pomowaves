export function getColor(mode){
    const backgroundColor = {
      pomodoro: "#ba4a49",
      shortBreak: "#38868a",
      longBreak: "#7e53a2",
    };
    return backgroundColor[mode]
  }