import { useState } from "react";
import Footer from "../../components/footer";
import AdminMenu from "../../components/adminMenu"; // Assume you have an Admin menu component

const AdminCreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    date_time: "",
    location: "",
    max_attendees: "",
    price: 0,
    event_cover: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // ---------------- HANDLE INPUT ---------------- //
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "event_cover" && files?.length) {
      setFormData({ ...formData, event_cover: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ---------------- HANDLE SUBMIT ---------------- //
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();
    for (const key in formData) {
      if (formData[key] || formData[key] === 0) body.append(key, formData[key]);
    }

    try {
      const res = await fetch("/api/admin/create-event/", {
        method: "POST",
        body,
      });

      if (res.ok) {
        setSubmitted(true);
        alert("Event created successfully!");
      } else {
        alert("Failed to create event.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 flex justify-end">
        <AdminMenu />
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-4 mb-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">Create New Event</h1>

        {submitted ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Event Created!</h2>
            <p className="text-gray-700">The event has been successfully added to the system.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                rows={5}
                required
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Date & Time</label>
              <input
                type="datetime-local"
                name="date_time"
                value={formData.date_time}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            {/* Max Attendees */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Max Attendees</label>
              <input
                type="number"
                name="max_attendees"
                value={formData.max_attendees}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Price (Optional)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Event Cover */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Event Cover</label>
              <input
                type="file"
                name="event_cover"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-600"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 w-48 h-48 object-cover rounded-xl border shadow"
                />
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="px-10 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition shadow-xl"
              >
                Create Event
              </button>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminCreateEvent;
