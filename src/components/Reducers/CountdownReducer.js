import { initialTimerState } from "./TimerReducer";
export const initialCountdownState = {
  secondsRemaining: initialTimerState.timers[initialTimerState.mode] * 60,
};

export function countdownReducer(countdownState, action) {
  switch (action.type) {
    case "countdown":
      return {
        ...countdownState,
        secondsRemaining: countdownState.secondsRemaining - 1,
      };
    case "setCountdown":
      return {
        ...countdownState,
        secondsRemaining: action.secondsRemaining,
      };
  }
}
