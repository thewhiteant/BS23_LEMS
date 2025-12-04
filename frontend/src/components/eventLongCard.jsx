import { useNavigate } from "react-router-dom";
import api from "../services/api";

const EventCard = ({ event, onDelete }) => {
  const isUpcoming = new Date(event.date_time) > new Date();
  const navigate = useNavigate();

  const deleteHandle = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`event/delete/${event.id}/`);
      onDelete(event.id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete event!");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col lg:flex-row justify-between gap-6 hover:shadow-lg transition-all duration-200">
      {/* LEFT CONTENT */}
      <div className="flex gap-5 flex-1">
        <img
          src={event.event_cover || "/default-event.jpg"}
          alt={event.title}
          className="w-28 h-28 lg:w-32 lg:h-32 rounded-xl object-cover border"
        />

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>

          <p className="text-gray-600 mt-1 line-clamp-2">{event.desc}</p>

          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p>
              📅{" "}
              {new Date(event.date_time).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p>📍 {event.location}</p>
            <p>
              👥 {event.attendees_count} / {event.max_attendees} RSVPs
            </p>
          </div>

          <span
            className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
              isUpcoming
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {isUpcoming ? "Upcoming Event" : "Past Event"}
          </span>
        </div>
      </div>

      <div className="flex flex-row lg:flex-col gap-3 justify-end">
        <button
          onClick={() => navigate(`/admin/event/edit/${event.id}`)}
          className="px-4 py-2 rounded-xl bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition"
        >
          ✏️ Edit
        </button>

        <button
          onClick={deleteHandle}
          className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default EventCard;
