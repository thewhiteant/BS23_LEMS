import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import default_icon from "../assets/default_icon.png";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.username || "User";
  const profileImage = user.profile_image || default_icon;

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
      {/* TOP BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 cursor-pointer 
        bg-white border border-gray-200 
        rounded-full p-2 shadow-sm 
        transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
      >
        <img
          src={profileImage}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
        <span className="font-medium text-gray-700">{username}</span>
        <span className="text-gray-500 text-xs">▼</span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute right-0 mt-3 w-56 
            bg-white border border-gray-200 
            rounded-2xl shadow-xl z-50 
            transition-all duration-150 
            origin-top-right scale-100 opacity-100
            animate-[fadeIn_0.15s_ease-out]
          "
        >
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-800">{username}</p>
            <p className="text-xs text-gray-500">Account</p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full text-left px-5 py-2 hover:bg-gray-100 transition"
          >
            🏠 Home
          </button>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="w-full text-left px-5 py-2 hover:bg-gray-100 transition"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate("/user/profile")}
            className="w-full text-left px-5 py-2 hover:bg-gray-100 transition"
          >
            👤 Edit Profile
          </button>

          <button className="w-full text-left px-5 py-2 hover:bg-gray-100 transition">
            ⚙️ Settings
          </button>

          <button className="w-full text-left px-5 py-2 hover:bg-gray-100 transition">
            💬 Feedback
          </button>

          <button
            onClick={() => navigate("/logout")}
            className="w-full text-left px-5 py-2 text-red-500 hover:bg-red-50 transition"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
