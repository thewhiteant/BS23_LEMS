import { useEffect, useState } from "react";
import Footer from "../../components/footer";
import ProfileMenu from "../../components/profileMenu";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import AdminMenu from "../../components/adminMenu";

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [eventData, setEventData] = useState(null);
  const [reg, setReg] = useState(false);

  // FETCH EVENT DATA
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await api.get(`event/edit/${id}/`);
        setEventData(res.data);

        // After eventData loaded, check if user registered
        const regRes = await api.get(`rsvp/register/`, {
          params: { event_id: res.data.id },
        });
        setReg(regRes.data.is_registered);
      } catch (err) {
        console.error("Error loading event or registration:", err);
      }
    };

    fetchEventData();
  }, [id]);

  // REGISTER FOR EVENT
  const registration = async () => {
    if (!eventData || reg) return;

    try {
      const res = await api.post("rsvp/register/", {
        event_id: eventData.id,
      });
      setReg(true);
      alert("Successfully registered!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error registering");
    }
  };

  // SHARE EVENT
  const shareEvent = async () => {
    if (!eventData) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: eventData.title,
          text: eventData.desc,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  //
  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Loading event...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HERO IMAGE */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <img
          src={eventData.event_cover}
          alt={eventData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-6 right-6 z-30">
          {user?.is_staff ? <AdminMenu /> : <ProfileMenu />}
        </div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 text-white max-w-5xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-2xl leading-tight">
            {eventData.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-lg md:text-xl">
            <span className="flex items-center gap-3">
              Calendar {eventData.date_time}
            </span>
            <span className="flex items-center gap-3">
              Location {eventData.location}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-10 py-16 w-full">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                About This Event
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {eventData.desc}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Event Details
              </h2>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 space-y-10">
                {/* Date & Time */}
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-9 h-9 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-5"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Date & Time</p>
                    <p className="text-gray-600 text-lg">
                      {eventData.date_time}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-9 h-9 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Location</p>
                    <p className="text-gray-600 text-lg">
                      {eventData.location}
                    </p>
                  </div>
                </div>

                {/* Attendees */}
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-9 h-9 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H9v-1c0-2.21-1.79-4-4-4s-4 1.79-4 4v1m12 0v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1m-8-9a4 100-8 4 4 0 000 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
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

          {/* RIGHT CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">
                Join This Event
              </h3>

              <div className="space-y-5">
                <button
                  onClick={registration}
                  disabled={reg}
                  className={`w-full py-5 font-bold text-lg rounded-xl transform hover:scale-105 transition shadow-lg ${
                    reg
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700"
                  }`}
                >
                  {reg ? "Registered" : "Register Now"}
                </button>

                <button className="w-full py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition">
                  Add to Calendar
                </button>

                <button
                  onClick={shareEvent}
                  className="w-full py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-3"
                >
                  Share Event
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  Organized by <br />
                  <span className="font-bold text-gray-800 text-lg">
                    BrainStations-23
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventPage;
