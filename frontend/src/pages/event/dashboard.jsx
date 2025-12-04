import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import HeroSlider from "../../components/autoSlider";
import EventCard from "../../components/eventCard";
import Footer from "../../components/footer";
import ProfileMenu from "../../components/profileMenu";
import AdminMenu from "../../components/adminMenu";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);

  // Fetch events from backend
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

  // Filter events based on search query and location
  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((ev) => {
      const title = ev.title?.toLowerCase() || "";
      const desc = ev.desc?.toLowerCase() || "";
      const location = ev.location?.toLowerCase() || "";

      // Location filter
      if (locationFilter === "dhaka" && !location.includes("dhaka"))
        return false;
      if (locationFilter === "online" && location.includes("dhaka"))
        return false;

      // Search filter
      if (!q) return true;
      return title.includes(q) || desc.includes(q) || location.includes(q);
    });
  }, [events, query, locationFilter]);

  const visibleEvents = filteredEvents.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Hero Slider: Pass events if available */}
      <HeroSlider events={events.length > 0 ? events : undefined} />

      <main className="m-10 p-[10px]">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-cherry font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight">
              All Events
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse upcoming events, workshops, and meetups.
            </p>
          </div>
          {/* <ProfileMenu /> */}
          <AdminMenu />
        </div>

        {/* Search & Filters */}
        <section
          aria-label="Search and filters"
          className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, description, or location..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cherry focus:border-transparent"
            />

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            >
              <option value="all">All locations</option>
              <option value="dhaka">Dhaka</option>
              <option value="online">Online</option>
            </select>

            <button
              onClick={() => {
                setQuery("");
                setLocationFilter("all");
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          </div>
        </section>

        {/* Events List */}
        <section aria-label="Events list">
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Loading events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No events found.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
              {visibleEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          )}

          {visibleCount < filteredEvents.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((v) => v + 8)}
                className="px-5 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
              >
                Load more
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
