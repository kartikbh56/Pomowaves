/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";
import {
  countdownReducer,
  initialCountdownState,
} from "../Reducers/CountdownReducer";

export const CountdownContext = createContext(null);

export default function CountdownContextProvider({ children }) {
  const [countdownState, dispatchCountdown] = useReducer(
    countdownReducer,
    initialCountdownState
  );
  return (
    <CountdownContext.Provider value={{ countdownState, dispatchCountdown }}>
      {children}
    </CountdownContext.Provider>
  );
}
