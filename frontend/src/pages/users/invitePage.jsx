import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Footer from "../../components/footer";

const InvitePage = () => {
  const { token } = useParams(); // ✅ token from URL

  const [guestEmail, setGuestEmail] = useState("");
  const [eventData, setEventData] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ FETCH EVENT USING TOKEN
  useEffect(() => {
    const fetchEventFromToken = async () => {
      try {
        const res = await api.get(`rsvp/guest-register/${token}/`);
        setEventData(res.data.event);
        setEventId(res.data.event_id);
      } catch (err) {
        setError("Invalid or expired invite link.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchEventFromToken();
  }, [token]);

  // ✅ REGISTER GUEST
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("rsvp/guest-register/", {
        guest_email: guestEmail,
        token: token, // ✅ hidden token
        event_id: eventId, // ✅ from backend
      });

      setMessage("✅ Successfully Registered!");
      setGuestEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING SCREEN
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Loading invitation...
      </div>
    );
  }

  // ✅ INVALID TOKEN
  if (!eventData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600 font-bold text-xl">
        Invalid or expired invite link.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border">
          <h1 className="text-3xl font-bold text-center mb-2 text-cherry">
            Event Invitation
          </h1>

          {/* ✅ EVENT INFO */}
          <div className="bg-gray-50 p-4 rounded-lg mb-5 text-center">
            <p className="font-bold text-lg">{eventData.title}</p>
            <p className="text-gray-600">{eventData.date_time}</p>
            <p className="text-gray-600">{eventData.location}</p>
          </div>

          {/* ✅ TOKEN DISPLAY */}
          <div className="bg-gray-100 p-3 rounded-lg text-sm text-center mb-6 break-all">
            <span className="font-semibold">Invite Token:</span>
            <br />
            {token}
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* ✅ GUEST EMAIL */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Guest Email
              </label>
              <input
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cherry outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              }`}
            >
              {loading ? "Registering..." : "Confirm Registration"}
            </button>
          </form>

          {/* ✅ SUCCESS MESSAGE */}
          {message && (
            <p className="mt-5 text-center text-green-600 font-semibold">
              {message}
            </p>
          )}

          {/* ✅ ERROR MESSAGE */}
          {error && (
            <p className="mt-5 text-center text-red-600 font-semibold">
              {error}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InvitePage;
