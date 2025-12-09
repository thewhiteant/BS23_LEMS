import { useEffect, useState } from "react";
import ProfileMenu from "../../components/profileMenu";
import Footer from "../../components/footer";
import EventLongCard from "../../components/eventLongCard";
import api from "../../services/api";
import AdminMenu from "../../components/adminMenu";
const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("user/dashboard/");

        console.log(res); // debug

        setEvents(res.data.events); // ✔ correct
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 flex justify-end">
        {user?.is_staff ? <AdminMenu /> : <ProfileMenu />}
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          User Dashboard
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upcoming Events
          </h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-600">No upcoming events.</p>
          ) : (
            <div className="grid gap-6">
              {upcomingEvents.map((ev) => (
                <EventLongCard key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Past Events
          </h2>
          {pastEvents.length === 0 ? (
            <p className="text-gray-600">No past events.</p>
          ) : (
            <div className="grid gap-6">
              {pastEvents.map((ev) => (
                <EventLongCard key={ev.id} event={ev} token={""} />
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
