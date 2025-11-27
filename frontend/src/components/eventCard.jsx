import React from "react";

const EventCard = ({ event }) => {
  const { image, title, description, dateTime, location } = event;

  return (
    <div className="bg-gray-50/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 w-full md:w-80 lg:w-96">
      {/* Event Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-t-xl"
      />

      {/* Event Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm md:text-base line-clamp-3">
          {description}
        </p>

        {/* Time & Location */}
        <div className="mt-2 flex flex-col gap-1 text-gray-500 text-sm">
          <span><strong>Time:</strong> {dateTime}</span>
          <span><strong>Location:</strong> {location}</span>
        </div>

        {/* Attend Button */}
        <button className="mt-3 px-5 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold rounded-lg hover:scale-105 hover:from-red-500 hover:to-pink-600 transition transform duration-300">
          Attend
        </button>
      </div>
    </div>
  );
};

export default EventCard;
