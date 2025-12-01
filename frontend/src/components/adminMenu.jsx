import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
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
      {/* Small round admin toggle button */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="admin"
        className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 bg-white"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <Link
            to="/admin/dashboard"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            📊 Dashboard
          </Link>

          <Link
            to="/admin/create-event"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            ➕ Create Event
          </Link>

          <Link
            to="/admin/event-requests"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            📥 Event Requests
          </Link>

          <button
            onClick={() => alert("Logout logic here")}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
          >
            🔴 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
