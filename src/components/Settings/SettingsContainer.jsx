import { useContext } from "react";
// import { IsOpenContext } from "../../contexts/context";
import { IsOpenContext } from "../../contexts/IsOpenContextProvider";

/* eslint-disable react/prop-types */
export default function SettingsContainer({ children, saveSettings }) {
  const {dispatchIsOpen} = useContext(IsOpenContext)
  const discardChanges = ()=> dispatchIsOpen({ type: "toggleMenu", menu: "settings" });
    return (
      <div
        className="modalview"
        onClick={discardChanges}
        onKeyDown={(e) => e.key === "Enter" && saveSettings()}
      >
        <div className="settings-container" onClick={(e) => e.stopPropagation()}>
          <div className="settings-header">SETTINGS</div>
          <img
            className="close-button"
            src="icons/close.png"
            onClick={discardChanges}
          />
          <div className="settingsContent">{children}</div>
        </div>
      </div>
    );
  }