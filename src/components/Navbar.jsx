/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, useRef } from "react";
import { IsOpenContext } from "../contexts/context";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { ImStatsBars } from "react-icons/im";
import { LuSettings2 } from "react-icons/lu";
import { FiLogIn } from "react-icons/fi";
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
      {icon}
      <span>{label}</span>
    </button>
  );
}

function UserDropdown({ user, isDropdownOpen, onLogout, dropdownRef }) {
  return (
    isDropdownOpen && (
      <div className="user-dropdown" ref={dropdownRef}>
        <div className="dropdown-menu open">
          <div className="user-name">{user?.name || "User"}</div>
          <div className="user-email">{user?.email || "User"}</div>
          <button id="logout-button" onClick={onLogout}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <img src="icons/enter.png" alt="Logout Icon" /> */}
              <FiLogIn style={{ margin: 5 }} />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
    )
  );
}

export default function Navbar({ user, setUser }) {
  const { dispatchIsOpen } = useContext(IsOpenContext);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleMenu = (menu) => {
    dispatchIsOpen({ type: "toggleMenu", menu });
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close dropdown when clicking outside or on the avatar button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.closest(".btn") === null
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
          icon=<ImStatsBars />
          label="Reports"
          onClick={() => handleToggleMenu("reports")}
        />

        <MenuButton
          icon=<LuSettings2 />
          label="Settings"
          onClick={() => handleToggleMenu("settings")}
        />

        <button className="btn" onClick={handleToggleDropdown}>
          <div className="avatar">{user.name.charAt(0)}</div>
          <span>{user.name.split(" ")[0]}</span>
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
