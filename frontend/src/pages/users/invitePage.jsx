import { useEffect, useState } from "react";
import Footer from "../../components/footer";
import ProfileMenu from "../../components/profileMenu";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import AdminMenu from "../../components/adminMenu";

const InvitePage = () => {
  const { token } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [guestEmail, setGuestEmail] = useState("");
  const [eventData, setEventData] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [rsvpToken, setRsvpToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ FETCH EVENT
  useEffect(() => {
    const fetchEventFromToken = async () => {
      try {
        const res = await api.get(`rsvp/guest-register/${token}`);
        setEventData(res.data.event);

        if (res.data.is_registered) {
          setIsRegistered(true);
          setRsvpToken(res.data.rsvp_token);
          setGuestEmail(res.data.guest_email || "");
        }
      } catch (err) {
        setError("Invalid or expired invite link.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchEventFromToken();
  }, [token]);

  // ✅ REGISTER
  const handleRegister = async () => {
    if (!guestEmail.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("rsvp/guest-register/", {
        guest_email: guestEmail,
        token,
      });

      setMessage("🎉 Successfully registered!");
      setIsRegistered(true);
      setRsvpToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CANCEL RSVP
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your RSVP?")) return;

    try {
      await api.post("rsvp/cancel-rsvp/", { token: rsvpToken });
      setMessage("❌ Your RSVP has been cancelled.");
      setIsRegistered(false);
      setRsvpToken(null);
      setGuestEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel");
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Loading invitation...
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">
        {error || "Invalid or expired invite link."}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ HERO */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={eventData.event_cover}
          alt={eventData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-6 right-6 z-30">
          {user?.is_staff ? <AdminMenu /> : <ProfileMenu />}
        </div>

        <div className="absolute bottom-6 left-6 md:left-12 text-white max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            {eventData.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-8 text-lg">
            <span>📅 {eventData.date_time}</span>
            <span>📍 {eventData.location}</span>
          </div>
        </div>
      </div>

      {/* ✅ MAIN */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-10 py-16 w-full">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* ✅ LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-14">
            {/* ABOUT */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About This Event
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {eventData.desc}
              </p>
            </section>

            {/* DETAILS */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Event Details
              </h2>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 space-y-12">
                {/* Date & Time */}
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-xl text-gray-800">
                      Date & Time
                    </p>
                    <p className="text-gray-600 text-lg">
                      {eventData.date_time}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-pink-100 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-xl text-gray-800">Location</p>
                    <p className="text-gray-600 text-lg">
                      {eventData.location}
                    </p>
                  </div>
                </div>

                {/* Attendees */}
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.354a4 4 0 110 5.292M15 21H9v-1c0-2.21-1.79-4-4-4s-4 1.79-4 4v1m12 0v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1m-8-9a4 4 0 100-8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-xl text-gray-800">
                      Expected Attendees
                    </p>
                    <p className="text-gray-600 text-lg">
                      ~{eventData.max_attendees?.toLocaleString() || 0} people
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ✅ RSVP CARD */}
          <div>
            <div className="bg-white rounded-3xl shadow-xl border p-8 sticky top-24">
              <h3 className="text-2xl font-bold mb-8 text-center">
                Your Invitation
              </h3>

              {isRegistered ? (
                <div className="space-y-6">
                  <div className="bg-green-100 border border-green-300 rounded-xl p-6 text-center">
                    <p className="text-green-800 font-bold text-lg">
                      ✅ You are registered!
                    </p>
                    <p className="text-sm text-gray-700 mt-2">{guestEmail}</p>
                  </div>

                  <button
                    onClick={handleCancel}
                    className="w-full py-4 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
                  >
                    Cancel My RSVP
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border rounded-xl"
                  />

                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className={`w-full py-4 font-bold rounded-xl transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700"
                    }`}
                  >
                    {loading ? "Registering..." : "Confirm & Register"}
                  </button>
                </div>
              )}

              {message && (
                <p className="mt-6 text-center text-green-600 font-semibold">
                  {message}
                </p>
              )}

              {error && (
                <p className="mt-6 text-center text-red-600 font-semibold">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InvitePage;
