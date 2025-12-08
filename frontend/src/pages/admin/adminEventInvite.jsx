import { useEffect, useState } from "react";
import AdminMenu from "../../components/adminMenu";
import Footer from "../../components/footer";
import api from "../../services/api";

const AdminEventInvite = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ LOAD ALL EVENTS
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("event/all/");
        setEvents(res.data);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    };
    fetchEvents();
  }, []);

  const generateInvite = async () => {
    if (!selectedEvent) return alert("Please select an event.");

    setLoading(true);
    try {
      const res = await api.post("rsvp/invite-link", {
        event_id: selectedEvent,
      });

      const backendLink = res.data.link;
      const token = backendLink.split("/invite/")[1].replace("/", "");
      const frontendLink = `${window.location.origin}/invite/${token}`;

      setInviteLink(frontendLink);
    } catch {
      alert("Failed to generate invite.");
    }

    setLoading(false);
  };

  const shareViaGmail = () => {
    // if (!inviteLink) return alert("No invite link found!");
    // const gmailUrl = ``;
    // window.open(gmailUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 flex justify-end">
        <AdminMenu />
      </div>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-6 mb-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Event Invite System
        </h1>

        {/* ✅ EVENT DROPDOWN */}
        <label className="block mb-2 font-semibold">Select Event</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        >
          <option value="">-- Select Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>

        <button
          onClick={generateInvite}
          className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 
                     text-white font-bold text-lg rounded-xl hover:scale-105 
                     transition shadow-lg"
        >
          {loading ? "Generating..." : "Generate Invite Link"}
        </button>

        {/* ✅ GENERATED LINK PANEL */}
        {inviteLink && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-xl space-y-3">
            <p className="font-semibold text-gray-600">Invite Link:</p>
            <p className="break-all text-blue-700">{inviteLink}</p>

            <p className="text-sm text-green-600">
              ✅ Link is valid for 12 hours automatically
            </p>

            <div className="flex flex-col gap-3">
              {/* ✅ COPY */}
              <button
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                className="w-full px-6 py-3 bg-gray-800 text-white rounded-xl 
                           hover:scale-105 transition shadow"
              >
                🔗 Copy Link
              </button>

              {/* ✅ EMAIL INPUT */}
              <input
                type="email"
                placeholder="Guest Email (Optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-xl"
              />

              {/* ✅ SHARE VIA GMAIL */}
              <button
                onClick={shareViaGmail}
                className="w-full px-6 py-3 bg-red-500 text-white rounded-xl 
                           hover:scale-105 transition shadow"
              >
                ✉️ Share via Gmail
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminEventInvite;
