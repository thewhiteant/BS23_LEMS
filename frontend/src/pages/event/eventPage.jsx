import { useState } from "react";
import Footer from "../../components/footer";
import ProfileMenu from "../../components/profileMenu"; // <-- Your component

// Import images
import cover from "../../assets/images/cover.jpg";
import cover1 from "../../assets/images/cover1.jpg";
import cover2 from "../../assets/images/cover2.jpg";
import cover3 from "../../assets/images/cover3.jpg";

const eventImages = [cover, cover1, cover2, cover3];

const eventData = {
  title: "React Conference 2025",
  description:
    "Join the biggest React conference with top speakers, workshops, and networking opportunities. Learn, network, and grow your skills in React and frontend development.",
  dateTime: "Dec 10, 2025 • 10:00 AM",
  location: "Dhaka, Bangladesh",
  organizer: "React Bangladesh Community",
  attendees: 1200,
};

const EventPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % eventImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + eventImages.length) % eventImages.length);
  };

  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventData.title,
          text: eventData.description,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HERO SLIDER WITH PROFILE MENU IN TOP-RIGHT */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden group">
        {/* Image */}
        <img
          src={eventImages[currentImageIndex]}
          alt={`${eventData.title} - Slide ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Prev / Next */}
        <button
          onClick={prevImage}
          aria-label="Previous"
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition opacity-0 group-hover:opacity-100 z-20"
        >
          ←
        </button>
        <button
          onClick={nextImage}
          aria-label="Next"
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition opacity-0 group-hover:opacity-100 z-20"
        >
          →
        </button>

        {/* PROFILE MENU - TOP RIGHT CORNER */}
        <div className="absolute top-6 right-6 z-30">
          <ProfileMenu />
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {eventImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImageIndex(i)}
              className={`h-3 rounded-full transition-all ${
                i === currentImageIndex ? "bg-white w-10" : "bg-white/50 w-3"
              }`}
            />
          ))}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 text-white max-w-5xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-2xl leading-tight">
            {eventData.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-lg md:text-xl">
            <span className="flex items-center gap-3">
              Calendar {eventData.dateTime}
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
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Event</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{eventData.description}</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Event Details</h2>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-9 h-9 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Date & Time</p>
                    <p className="text-gray-600 text-lg">{eventData.dateTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-9 h-9 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Location</p>
                    <p className="text-gray-600 text-lg">{eventData.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-9 h-9 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H9v-1c0-2.21-1.79-4-4-4s-4 1.79-4 4v1m12 0v-1c0-2.21 1.79-4 4-4s4 1.79 4 4v1m-8-9a4 100-8 4 4 0 000 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Expected Attendees</p>
                    <p className="text-gray-600 text-lg">~{eventData.attendees.toLocaleString()} people</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Sticky Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Join This Event</h3>
              <div className="space-y-5">
                <button className="w-full py-5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition shadow-lg">
                  Register Now
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
                  Organized by<br />
                  <span className="font-bold text-gray-800 text-lg">{eventData.organizer}</span>
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