import { useContext } from "react";
import { IsOpenContext } from "./Contexts/Context";

/* eslint-disable react/prop-types */
export default function Navbar() {
  const { dispatchIsOpen } = useContext(IsOpenContext);
  function handleToggleReports(){
    dispatchIsOpen({type:'toggleMenu',menu:'reports'})
  }
  function handleToggleSettings(){
    dispatchIsOpen({type:'toggleMenu',menu:'settings'})
  }
  return (
    <header>
      <div className="logo">
        <img src="icons/logo.png" alt="Pomofocus Logo" className="logo-img" />
        <span>PomoWaves</span>
      </div>

      <div className="buttons">
        <button className="btn" onClick={handleToggleReports}>
          <img src="icons/report.png" />
          <span>Report</span>
        </button>

        <button className="btn" onClick={handleToggleSettings}>
          <img src="icons/settings.png" />
          <span>Setting</span>
        </button>
        
        <button className="btn">
          <img src="icons/user.png" />
          <span>Sign in</span>
        </button>
      </div>
    </header>
  );
}
