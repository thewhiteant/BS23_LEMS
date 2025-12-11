// src/pages/admin/EventRSVPPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Footer from "../../components/footer";

const EventRSVPPage = () => {
  const { id } = useParams();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        const res = await api.get(`rsvp/list?event_id=${id}`);
        setRsvps(res.data);
      } catch (err) {
        console.error("Error loading RSVPs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRSVPs();
  }, [id]);

  const filteredRSVPs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rsvps.filter((rsvp) => {
      const name = rsvp.user
        ? `${rsvp.user.first_name} ${rsvp.user.last_name}`.toLowerCase()
        : "";
      const email =
        rsvp.user?.email?.toLowerCase() ||
        rsvp.guest_email?.toLowerCase() ||
        "";
      const matchesQuery = !q || name.includes(q) || email.includes(q);
      const matchesStatus =
        statusFilter === "all" || rsvp.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [rsvps, query, statusFilter]);

  const downloadCSV = () => {
    if (!rsvps || rsvps.length === 0) return;

    const headers = [
      "Full Name",
      "Email Address",
      "User Type",
      "RSVP Status",
      "Token",
    ];

    const rows = rsvps.map((rsvp) => {
      const fullName = rsvp.user
        ? `${rsvp.user.first_name || ""} ${rsvp.user.last_name || ""}`.trim() ||
          rsvp.user.username
        : "Guest";
      const email = rsvp.user?.email || rsvp.guest_email || "";
      const userType = rsvp.user ? "Registered" : "Guest";
      const status = rsvp.status.charAt(0).toUpperCase() + rsvp.status.slice(1);
      return [fullName, email, userType, status, rsvp.token];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `event_${id}_rsvps.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 m-10">
        <h1 className="text-3xl font-bold text-cherry mb-4">Event RSVPs</h1>

        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cherry"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
            }}
            className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-100 transition"
          >
            Clear
          </button>
          <button
            onClick={downloadCSV}
            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Download CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading RSVPs...
          </div>
        ) : filteredRSVPs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No RSVPs found.</div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg bg-white">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-cherry text-black">
                <tr>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">Email Address</th>
                  <th className="px-4 py-2 text-left">User Type</th>
                  <th className="px-4 py-2 text-left">RSVP Status</th>
                  <th className="px-4 py-2 text-left">Token</th>
                </tr>
              </thead>
              <tbody>
                {filteredRSVPs.map((rsvp, index) => (
                  <tr
                    key={rsvp.token}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-2">
                      {rsvp.user
                        ? `${rsvp.user.username}`.trim() || rsvp.user.username
                        : "Guest"}
                    </td>
                    <td className="px-4 py-2">
                      {rsvp.user?.email || rsvp.guest_email}
                    </td>
                    <td className="px-4 py-2">
                      {rsvp.user ? "Registered" : "Guest"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          rsvp.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rsvp.status.charAt(0).toUpperCase() +
                          rsvp.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 break-all">{rsvp.token}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EventRSVPPage;
