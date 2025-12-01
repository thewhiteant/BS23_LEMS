import { useState, useRef, useEffect } from "react";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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
      <img
        src="https://i.pravatar.cc/100" // replace with your profile image
        alt="profile"
        className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
        onClick={() => setOpen(!open)}
      />

      {/* DROPDOWN MENU */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Edit Profile
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Settings
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
            Feedback
          </button>
          <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
