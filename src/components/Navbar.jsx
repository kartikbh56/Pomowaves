/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, useRef } from "react";
import { IsOpenContext } from "../contexts/context";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

function Logo() {
  return (
    <div className="logo">
      <img src="icons/logo.png" alt="Pomofocus Logo" className="logo-img" />
      <span>PomoWaves</span>
    </div>
  );
}

function MenuButton({ icon, label, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      <img src={icon} alt={`${label} Icon`} />
      <span>{label}</span>
    </button>
  );
}

function UserDropdown({ user, isDropdownOpen, onLogout, dropdownRef }) {
  return (
    isDropdownOpen && (
      <div className="user-dropdown" ref={dropdownRef}>
        <div className="dropdown-menu open">
          <div className="user-info">{user?.name || "User"}</div>
          <div className="user-info">{user?.email || "User"}</div>
          <button id="logout-button" onClick={onLogout}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src="icons/enter.png" alt="Logout Icon" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
    )
  );
}

export default function Navbar({ user }) {
  const { dispatchIsOpen } = useContext(IsOpenContext);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleMenu = (menu) => {
    dispatchIsOpen({ type: "toggleMenu", menu });
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <Logo />

      <div className="buttons">
        <MenuButton
          icon="icons/report.png"
          label="Report"
          onClick={() => handleToggleMenu("reports")}
        />

        <MenuButton
          icon="icons/settings.png"
          label="Setting"
          onClick={() => handleToggleMenu("settings")}
        />

        <button className="btn" onClick={handleToggleDropdown}>
            <img
              src="/icons/user.png"
              alt="User Avatar"
              style={{ borderRadius: "15px", width: "20px", height: "20px" }}
            />
          <span>{user.name}</span>
        </button>

        <UserDropdown
          user={user}
          isDropdownOpen={isDropdownOpen}
          onLogout={handleLogout}
          dropdownRef={dropdownRef} // Pass the ref to the dropdown
        />
      </div>
    </header>
  );
}
