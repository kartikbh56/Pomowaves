/* eslint-disable react/prop-types */
import { useContext } from "react";
import { IsOpenContext } from "../contexts/context";
export default function ReportsContainer({ children }) {
  const { dispatchIsOpen } = useContext(IsOpenContext);
  const closeModal = () =>
    dispatchIsOpen({ type: "toggleMenu", menu: "reports" });
  return (
    <div className="modalview" onClick={closeModal}>
      <div className="reports-container" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
