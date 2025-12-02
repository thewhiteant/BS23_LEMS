import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import default_icon from "../assets/default_icon.png";

const ProfileMenu = ({ username = "User" }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* SMALL ROUND IMAGE BUTTON */}
      <div
        className="flex items-center cursor-pointer border border-gray-300 rounded-full p-1"
        onClick={() => setOpen(!open)}
      >
        <img
          src={default_icon}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <span className="ml-2 font-medium">{username}</span>
      </div>

      {/* DROPDOWN MENU */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => navigate("/user/dashboard")}
          >
            Dashboard
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => navigate("/user/profile")}
          >
            Edit Profile
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Settings
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Feedback
          </button>
          <button
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            onClick={() => navigate("/logout")}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
