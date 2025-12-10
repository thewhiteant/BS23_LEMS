import React, { useEffect } from "react";

const PopupAlert = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed top-5 right-5 text-white px-4 py-2 rounded shadow-lg ${colors[type]}`}
    >
      {message}
      <button className="ml-2 font-bold" onClick={onClose}>
        ✖
      </button>
    </div>
  );
};

export default PopupAlert;
