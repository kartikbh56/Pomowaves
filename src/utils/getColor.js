export function getColor(mode){
    const backgroundColor = {
      pomodoro: "rgb(186, 74, 73)",
      shortBreak: "#38868a",
      longBreak: "#7e53a2",
    };
    return backgroundColor[mode]
  }