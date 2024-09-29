/* eslint-disable react/prop-types */
import { useContext,useEffect, useRef } from "react";
import { TasksContext,TimerContext } from "../Contexts/Context";
export default function StartButton({firstClick}) {

    const {timerState:{status,mode,autoStartBreaks,autoStartPomodoros},dispatchTimerState} = useContext(TimerContext)
    const {tasksState,dispatchTasks} = useContext(TasksContext)
  
    const buttonRef = useRef(null);
    useEffect(() => {
      if (firstClick.current) {
        if (
          (mode === "pomodoro" && autoStartPomodoros && status === "initial") ||
          ((mode === "shortBreak" || mode === "longBreak") &&
            autoStartBreaks &&
            status === "initial")
        ) {
          const timer = setTimeout(() => {
            buttonRef.current.click();
          }, 1500);
          return () => {
            clearTimeout(timer);
          };
        }
      }
    }, [mode, autoStartBreaks, status, autoStartPomodoros, firstClick]);
    function handleClick() {
      firstClick.current = true;
      status === "started"
        ? dispatchTimerState({ type: "paused" })
        : dispatchTimerState({ type: "started" });
      if (status === "initial" && mode === "pomodoro" && tasksState.currentTask)
        dispatchTasks({ type: "sortTasks" });
  
      const currentTask = tasksState.currentTask
            ? tasksState.tasks.find((t) => t.id === tasksState.currentTask)
            : tasksState.currentTask;
      if(currentTask.completed>=currentTask.estimated && mode==="pomodoro"){
        const newTasks = tasksState.tasks.map((task) =>
          task.id === currentTask.id
            ? { ...task, estimated:task.estimated+1 }
            : task
        );
        dispatchTasks({type:"setTasks",tasks:newTasks,currentTask:currentTask.id})
        dispatchTasks({ type: "sortTasks" });
      }
      new Audio("sounds/finger-snap.mp3").play();
    }
    const btnColor =
      mode === "pomodoro"
        ? "rgb(186, 73, 73)"
        : mode === "shortBreak"
        ? "rgb(56, 134, 138)"
        : "rgb(126, 83, 162)";
    return (
      <button
        className="startbtn"
        style={{
          color: btnColor,
          boxShadow: status === "started" && "none",
          transform: status === "started" && "translateY(6px)",
        }}
        ref={buttonRef}
        onClick={handleClick}
      >
        {status === "started" ? "PAUSE" : "START"}
      </button>
    );
  }