/* eslint-disable react/prop-types */
// import { useReducer } from "react";
// import { reportsReducer,initialReports } from "../Reducers/ReportsReducer";
// import { ReportsContext } from "../contexts/context";
export default function ReportsContainer({ children }) {
    // const [reportsState, dispatchReports] = useReducer(
    //   reportsReducer,
    //   initialReports
    // );
    return (
      <div className="reports-container" onClick={(e) => e.stopPropagation()}>
        {/* <ReportsContext.Provider value={{ reportsState, dispatchReports }}> */}
          {children}
        {/* </ReportsContext.Provider> */}
      </div>
    );
  }