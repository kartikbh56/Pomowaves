import { useContext, useState } from "react";
import { IsOpenContext } from "./contexts/context";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/appwrite";
import { useEffect } from "react";
import "./UserDropdown.css";
import { fetchGoogleProfile } from "../lib/appwrite";

/* eslint-disable react/prop-types */
export default function Navbar({ user }) {
  const { dispatchIsOpen } = useContext(IsOpenContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  useEffect(() => {
    fetchGoogleProfile().then((picture) => {
      setUserAvatar(picture);
    });
  }, []);
  const navigate = useNavigate();

  function handleToggleReports() {
    dispatchIsOpen({ type: "toggleMenu", menu: "reports" });
  }

  function handleToggleSettings() {
    dispatchIsOpen({ type: "toggleMenu", menu: "settings" });
  }

  function handleToggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  console.log(user);

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

        <button className="btn" onClick={handleToggleDropdown}>
          {userAvatar && <img src={userAvatar} style={{ borderRadius: "15px", width:"20px",height:"20px" }} />}
          <span>{user.name}</span>
        </button>
        <div className="user-dropdown">
          <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
            <div className="user-info">{user?.name || "User"}</div>
            <div className="user-info">{user?.email || "User"}</div>
            <button id="logout-button" onClick={handleLogout}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={"icons/enter.png"} />
                Logout
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
