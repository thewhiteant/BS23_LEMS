import { useEffect, useState, useRef } from "react";
import AdminMenu from "../../components/adminMenu";
import Footer from "../../components/footer";
import api from "../../services/api";

const AdminEventInvite = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [inviteLink, setInviteLink] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef();

  // ✅ LOAD ALL EVENTS
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("event/all/");
        setEvents(res.data);
        setFilteredEvents(res.data); // initially show all
      } catch (err) {
        console.error("Error loading events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter events as user types
  useEffect(() => {
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered.slice(0, 50)); // show max 50 suggestions
  }, [searchTerm, events]);

  const generateInvite = async () => {
    if (!selectedEvent) return alert("Please select an event.");

    setLoading(true);
    try {
      const res = await api.post("rsvp/invite-link", {
        event_id: selectedEvent.id,
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

  const shareViaGmail = async () => {
    if (!email) return alert("Please enter guest email.");
    if (!inviteLink) return alert("Please generate the invite link first.");

    try {
      const res = await api.post("rsvp/send-mail/", {
        recipient: email,
        subject: `You're invited to ${selectedEvent.title}`,
        message: `Hello,\n\nYou have been invited to the event "${selectedEvent.title}".\n\nJoin using this link: ${inviteLink}\n\nBest regards,\nEvent Team`,
      });

      if (res.data.status === "success") {
        alert("Email sent! Check console.");
        setEmail(""); // clear input
      } else {
        alert("Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending email.");
    }
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

        {/* ✅ SEARCHABLE DROPDOWN */}
        <div className="mb-4 relative" ref={dropdownRef}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDropdownOpen(true);
            }}
            placeholder={
              selectedEvent ? selectedEvent.title : "-- Select Event --"
            }
            className="w-full p-3 border rounded-xl shadow hover:shadow-lg transition bg-white"
            onFocus={() => setDropdownOpen(true)}
          />

          {dropdownOpen && filteredEvents.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setSearchTerm(event.title);
                    setDropdownOpen(false);
                  }}
                  className="p-3 hover:bg-red-100 cursor-pointer transition"
                >
                  {event.title}
                </div>
              ))}
            </div>
          )}

          {dropdownOpen && filteredEvents.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg p-3 text-gray-400">
              No events found
            </div>
          )}
        </div>

        {/* ✅ GENERATE LINK BUTTON */}
        <button
          onClick={generateInvite}
          className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 
                     text-white font-bold text-lg rounded-xl hover:scale-105 
                     transition shadow-lg"
        >
          {loading ? "Generating..." : "Generate Invite Link"}
        </button>

        {/* ✅ INVITE LINK PANEL */}
        {inviteLink && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-xl space-y-3">
            <p className="font-semibold text-gray-600">Invite Link:</p>
            <p className="break-all text-blue-700">{inviteLink}</p>
            <p className="text-sm text-green-600">
              ✅ Link is valid for 12 hours automatically
            </p>

            <div className="flex flex-col gap-3">
              {/* COPY LINK */}
              <button
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                className="w-full px-6 py-3 bg-gray-800 text-white rounded-xl hover:scale-105 transition shadow"
              >
                🔗 Copy Link
              </button>

              {/* EMAIL INPUT */}
              <input
                type="email"
                placeholder="Guest Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-xl"
              />

              {/* SHARE VIA GMAIL */}
              <button
                onClick={shareViaGmail}
                className="w-full px-6 py-3 bg-red-500 text-white rounded-xl hover:scale-105 transition shadow"
              >
                ✉️ Share via mail
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
