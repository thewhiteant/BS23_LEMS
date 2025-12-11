import { useState } from "react";
import Footer from "../../components/footer";
import AdminMenu from "../../components/adminMenu";
import api from "../../services/api";
import PopupAlert from "../../components/popupAlert";

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
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "event_cover" && files?.length) {
      setFormData({ ...formData, event_cover: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("desc", formData.desc);
      data.append("date_time", formData.date_time);
      data.append("location", formData.location);
      data.append("max_attendees", formData.max_attendees);
      data.append("price", formData.price);

      if (formData.event_cover) {
        data.append("event_cover", formData.event_cover);
      }

      await api.post("event/add/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
      setAlert({
        visible: true,
        message: "Event created successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Event creation failed:", err);
      let message = "Failed to create event!";
      if (err.response?.data) {
        const errors = err.response.data;
        const messages = Object.values(errors)
          .flat()
          .map((e) =>
            typeof e === "string" ? e : Object.values(e).flat().join(" ")
          );

        message = messages.join(" ");
      }
      setAlert({
        visible: true,
        message,
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {alert.visible && (
        <PopupAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      <div className="p-6 flex justify-end">
        <AdminMenu />
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-4 mb-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">
          Create New Event
        </h1>

        {submitted ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Event Created!
            </h2>
            <p className="text-gray-700">
              The event has been successfully added to the system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                rows={5}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="date_time"
                value={formData.date_time}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                name="max_attendees"
                value={formData.max_attendees}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price (Optional)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Event Cover
              </label>
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition shadow-xl disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Event"}
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
