// src/components/UserCardLong.jsx
import React from "react";

const EventLongCard = ({ event }) => {
  const now = new Date();

  return (
    <div className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-xl transition p-5 flex gap-5">
      <img
        src={event.event_cover || "/default-event.jpg"}
        className="w-32 h-32 rounded-xl object-cover"
        alt={event.title}
      />
      <div className="flex flex-col justify-between w-full">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
          <p className="text-gray-600 mt-1">{event.desc}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            <p>
              Date:{" "}
              {new Date(event.date_time).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p>Location: {event.location}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              new Date(event.date_time) > now
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {new Date(event.date_time) > now ? "Upcoming" : "Past"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventLongCard;
