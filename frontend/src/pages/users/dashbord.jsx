import { useEffect, useState } from "react";
import ProfileMenu from "../../components/profileMenu";
import Footer from "../../components/footer";

const demoEvents = [
  {
    id: 1,
    title: "Tech Conference 2025",
    desc: "A large tech conference featuring top speakers and workshops.",
    date_time: "2025-02-15T10:00:00Z",
    location: "Dhaka Convention Center",
    event_cover: "",
  },
  {
    id: 2,
    title: "React Developer Bootcamp",
    desc: "Hands-on React training with expert developers.",
    date_time: "2025-01-10T14:00:00Z",
    location: "Banani Tech Hub",
    event_cover: "",
  },
  {
    id: 3,
    title: "AI & Machine Learning Meetup",
    desc: "Meet and learn with AI researchers.",
    date_time: "2025-03-05T17:00:00Z",
    location: "GP House Auditorium",
    event_cover: "",
  },
  {
    id: 4,
    title: "Cyber Security Workshop",
    desc: "Learn how to protect yourself from online attacks.",
    date_time: "2024-12-20T09:30:00Z",
    location: "Daffodil University Lab 4",
    event_cover: "",
  },
  {
    id: 5,
    title: "Photography Masterclass",
    desc: "Learn photography from professional photographers.",
    date_time: "2025-01-25T11:00:00Z",
    location: "Bashundhara Studio Hall",
    event_cover: "",
  },
];

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/user/events/");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          // Use demo events if API fails
          setEvents(demoEvents);
        }
      } catch (err) {
        console.log("Error loading events, using demo events", err);
        setEvents(demoEvents);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading events...
      </div>
    );
  }

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date_time) >= now);
  const pastEvents = events.filter((e) => new Date(e.date_time) < now);

  const EventCard = ({ event }) => (
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 flex justify-end">
        <ProfileMenu />
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">User Dashboard</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-600">No upcoming events.</p>
          ) : (
            <div className="grid gap-6">
              {upcomingEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Events</h2>
          {pastEvents.length === 0 ? (
            <p className="text-gray-600">No past events.</p>
          ) : (
            <div className="grid gap-6">
              {pastEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
