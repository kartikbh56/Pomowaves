/* eslint-disable react/prop-types */
import { AlarmClockCheck, Armchair, Coffee, Flame } from "lucide-react";
import { useTimerStore } from "../../store/useTimerStore";
import { getColor } from "../../utils/getColor";
import CircularProgress from "../circular-progress";
import StartButton from "./StartButton";
import { getFinishTime } from "../../utils/formatDate";

// Time.jsx
const MODE_ICONS = {
  pomodoro: { icon: Flame, message: "Time to focus!" },
  shortBreak: { icon: Coffee, message: "Time for a short break" },
  longBreak: { icon: Armchair, message: "Time for a long break" },
};

export default function Clock({ firstClick }) {
  const secondsRemaining = useTimerStore((state) => state.secondsRemaining);
  const mode = useTimerStore((state) => state.mode);
  const completedPomodoros = useTimerStore((state) => state.completedPomodoros);
  const startedAt = useTimerStore((state) => state.startedAt);
  const currentTimer = useTimerStore((state) => state[state.mode]); // current mode timer (pomodoro, shortBreak, longBreak)
  const progress = 100 - (secondsRemaining * 100) / (currentTimer * 60);
  const time =
    `${Math.floor(secondsRemaining / 60)}`.padStart(2, "0") +
    " : " +
    `${secondsRemaining % 60}`.padStart(2, "0");

  const finishAt = startedAt
    ? getFinishTime(
        currentTimer * 60 - (new Date() - new Date(startedAt)) / 1000,
      ) // time required in seconds
    : getFinishTime(currentTimer * 60);

  const { icon: Icon, message } = MODE_ICONS[mode];

  // Responsive sizing
  const circleSize = 400;
  const strokeWidth = 25;
  const iconSize = "h-4 w-4";

  return (
    <div className={`text-center space-y-2`}>
      <div className="flex justify-center">
        <CircularProgress
          progress={progress}
          size={circleSize}
          strokeWidth={strokeWidth}
          className={"w-[300px] h-[300px] xl:w-[320px] xl:h-[320px]"}
          color={getColor(mode)}
        >
          <div className="text-center px-4">
            <div
              className={`text-xs sm:text-sm text-sm text-muted-foreground mb-5 flex items-center justify-center gap-1`}
            >
              <Icon className={iconSize} />
              {message}
            </div>
            <div
              className={`text-5xl xl:text-6xl font-bold tabular-nums tracking-normal duration-300`}
              style={{ color: getColor(mode) }}
            >
              {time}
            </div>
            <div
              className={`text-xs sm:text-sm text-sm text-muted-foreground mt-5 flex items-center justify-center gap-1`}
            >
              <span className="flex items-center justify-center">
                <AlarmClockCheck className="mr-1 h-4 w-4" />
              </span>
              Finish at: {finishAt.hh + ":" + finishAt.mm + " " + finishAt.ampm}
            </div>
          </div>
        </CircularProgress>
      </div>
      <div className="text-xs text-muted-foreground">
        #{mode === "pomodoro" ? completedPomodoros + 1 : completedPomodoros}
      </div>
      <StartButton firstClick={firstClick} />
    </div>
  );
}
