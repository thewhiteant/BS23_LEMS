import { useState } from "react";
import AdminMenu from "../../components/adminMenu";
import Footer from "../../components/footer";
import EventCard from "../../components/eventLongCard";
import api from "../../services/api";
import { useEffect } from "react";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("event/all/");
        setEvents(res.data);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEdit = (event) => {
    alert(`Edit event: ${event.title}`);
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleApprove = (id) => {
    setEvents(
      events.map((e) => (e.id === id ? { ...e, is_approved: true } : e))
    );
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upcoming Events
          </h2>
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

        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Past Events
          </h2>
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
