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

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch events
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

  // Filter events
  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((ev) => {
      const title = ev.title?.toLowerCase() || "";
      const desc = ev.desc?.toLowerCase() || "";
      const location = ev.location?.toLowerCase() || "";

      if (locationFilter === "dhaka" && !location.includes("dhaka"))
        return false;
      if (locationFilter === "online" && location.includes("dhaka"))
        return false;

      if (!q) return true;
      return title.includes(q) || desc.includes(q) || location.includes(q);
    });
  }, [events, query, locationFilter]);

  // RESET PAGE WHEN FILTER OR SEARCH CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [query, locationFilter]);

  // PAGINATION CALCULATION
  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Hero Slider */}
      <HeroSlider events={events.length > 0 ? events : undefined} />

      {/* Floating Profile/Admin Menu */}
      <div className="fixed top-4 right-4 z-[9999]">
        {user?.is_staff ? <AdminMenu /> : <ProfileMenu />}
      </div>

      <main className="m-10 p-[10px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-cherry font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight">
            All Events
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse upcoming events, workshops, and meetups.
          </p>
        </div>

        {/* Search & Filter */}
        <section className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, description, or location..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cherry"
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

        {/* Events */}
        <section>
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Loading events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No events found.
            </div>
          ) : (
            <>
              {/* Events list */}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
                {currentEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10 flex justify-center gap-2 flex-wrap">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ◀ Prev
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === i + 1
                        ? "bg-cherry text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next ▶
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
