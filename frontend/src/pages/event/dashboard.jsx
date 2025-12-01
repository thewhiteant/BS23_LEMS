import { useMemo, useState } from "react";

import HeroSlider from "../../components/autoSlider";
import EventCard from "../../components/eventCard";
import Footer from "../../components/footer";
import ProfileMenu from "../../components/profileMenu";
import cover from "../../assets/images/cover.jpg";


const sampleEvent = {
  image: cover,
  title: "React Conference 2025",
  description:
    "Join the biggest React conference with top speakers, workshops, and networking opportunities.",
  dateTime: "Dec 10, 2025 - 10:00 AM",
  location: "Dhaka, Bangladesh",
};

const Dashboard = () => {
  const initialEvents = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        ...sampleEvent,
        title: `${sampleEvent.title} — Track ${Math.floor(i / 3) + 1}`,
        description:
          sampleEvent.description +
          ` This is sample card #${i + 1}. Learn, network and grow.`,
        dateTime: `Dec ${10 + (i % 5)}, 2025 - ${9 + (i % 6)}:00 AM`,
        location: i % 2 === 0 ? "Dhaka, Bangladesh" : "Remote / Online",
      })),
    []
  );

  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialEvents.filter((ev) => {
      if (locationFilter === "dhaka" && !/dhaka/i.test(ev.location))
        return false;
      if (locationFilter === "online" && /dhaka/i.test(ev.location))
        return false;
      if (!q) return true;
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q)
      );
    });
  }, [initialEvents, query, locationFilter]);

  const visibleEvents = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <HeroSlider />

      <main className="m-10 p-[10px]">

        {/* TITLE + PROFILE BUTTON */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-cherry font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight">
              All Events
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse upcoming events, workshops and meetups.
            </p>
          </div>

          {/* Profile Menu on RIGHT */}
          <ProfileMenu />
        </div>

        {/* SEARCH & FILTERS */}
        <section
          aria-label="Search and filters"
          className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            
            {/* Search */}
            <div className="flex-1">
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, description, or location..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cherry focus:border-transparent"
              />
            </div>

            {/* Location Filter */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
            >
              <option value="all">All locations</option>
              <option value="dhaka">Dhaka</option>
              <option value="online">Online</option>
            </select>

            {/* Reset */}
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

          {/* Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {["Workshops", "Meetups", "Conferences", "Online", "Free"].map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  className="text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-cherry/10 transition"
                >
                  {c}
                </button>
              )
            )}
          </div>
        </section>

        {/* EVENTS */}
        <section aria-label="Events list">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No events found.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
              {visibleEvents.map((ev, i) => (
                <EventCard key={`${ev.title}-${i}`} event={ev} />
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
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
