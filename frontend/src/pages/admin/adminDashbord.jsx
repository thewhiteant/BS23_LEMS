import { useState } from "react";
import AdminMenu from "../../components/adminMenu";
import Footer from "../../components/footer";

// ---------------- DEMO EVENTS ---------------- //
const demoEvents = [
  {
    id: 1,
    title: "Tech Conference 2025",
    desc: "A large tech conference featuring top speakers and workshops.",
    date_time: "2025-02-15T10:00:00Z",
    location: "Dhaka Convention Center",
    max_attendees: 300,
    attendees_count: 120,
    event_cover: "/demo/events/tech_conference.jpg",
    is_approved: false,
  },
  {
    id: 2,
    title: "React Developer Bootcamp",
    desc: "Hands-on React training with expert developers.",
    date_time: "2025-01-10T14:00:00Z",
    location: "Banani Tech Hub",
    max_attendees: 50,
    attendees_count: 50,
    event_cover: "/demo/events/react_bootcamp.jpg",
    is_approved: true,
  },
  {
    id: 3,
    title: "AI & Machine Learning Meetup",
    desc: "Meet and learn with AI researchers.",
    date_time: "2025-03-05T17:00:00Z",
    location: "GP House Auditorium",
    max_attendees: 120,
    attendees_count: 80,
    event_cover: "/demo/events/ai_meetup.jpg",
    is_approved: false,
  },
  {
    id: 4,
    title: "Cyber Security Workshop",
    desc: "Learn how to protect yourself from online attacks.",
    date_time: "2024-12-20T09:30:00Z",
    location: "Daffodil University Lab 4",
    max_attendees: 80,
    attendees_count: 75,
    event_cover: "/demo/events/cyber_security.jpg",
    is_approved: true,
  },
  {
    id: 5,
    title: "Photography Masterclass",
    desc: "Learn photography from professional photographers.",
    date_time: "2025-01-25T11:00:00Z",
    location: "Bashundhara Studio Hall",
    max_attendees: 60,
    attendees_count: 40,
    event_cover: "/demo/events/photography.jpg",
    is_approved: false,
  },
];

// ---------------- EVENT CARD COMPONENT ---------------- //
const EventCard = ({ event, onEdit, onDelete, onApprove }) => {
  const now = new Date();
  const isUpcoming = new Date(event.date_time) > now;

  return (
    <div className="bg-white border rounded-xl shadow-md p-5 flex flex-col md:flex-row justify-between gap-5 hover:shadow-xl transition">
      <div className="flex gap-5 flex-1">
        <img
          src={event.event_cover || "/default-event.jpg"}
          alt={event.title}
          className="w-32 h-32 rounded-xl object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
          <p className="text-gray-600 mt-1">{event.desc}</p>
          <p className="text-sm text-gray-700 mt-2">
            Date:{" "}
            {new Date(event.date_time).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p className="text-sm text-gray-700">Location: {event.location}</p>
          <p className="text-sm text-gray-700">
            RSVPs: {event.attendees_count} / {event.max_attendees}
          </p>
          <span
            className={`inline-block mt-2 px-2 py-1 text-sm font-semibold rounded-full ${
              event.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {event.is_approved ? "Approved" : "Pending Approval"}
          </span>
          <span
            className={`inline-block mt-2 ml-2 px-2 py-1 text-sm font-semibold rounded-full ${
              isUpcoming ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-700"
            }`}
          >
            {isUpcoming ? "Upcoming" : "Past"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onEdit(event)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(event.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
          Delete
        </button>

        {!event.is_approved && (
          <button
            onClick={() => onApprove(event.id)}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
          >
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

// ---------------- ADMIN DASHBOARD ---------------- //
const AdminDashboard = () => {
  const [events, setEvents] = useState(demoEvents);

  const handleEdit = (event) => {
    alert(`Edit event: ${event.title}`);
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleApprove = (id) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, is_approved: true } : e)));
  };

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date_time) >= now);
  const pastEvents = events.filter((e) => new Date(e.date_time) < now);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 flex justify-end">
        <AdminMenu />
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard (Demo)</h1>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-600">No upcoming events.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {upcomingEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                />
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Events</h2>
          {pastEvents.length === 0 ? (
            <p className="text-gray-600">No past events.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {pastEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
