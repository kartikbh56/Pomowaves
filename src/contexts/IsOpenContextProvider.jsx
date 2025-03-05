/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";
import { initialIsOpenState, isOpenReducer } from "../Reducers/IsOpenReducer";

export const IsOpenContext = createContext(null);

export default function IsOpenContextProvider({ children }) {
  const [isOpenState, dispatchIsOpen] = useReducer(
    isOpenReducer,
    initialIsOpenState
  );
  return (
    <IsOpenContext.Provider value={{ isOpenState, dispatchIsOpen }}>
      {children}
    </IsOpenContext.Provider>
  );
}
