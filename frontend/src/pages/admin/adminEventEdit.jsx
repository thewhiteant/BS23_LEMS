import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/footer";

const AdminEventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("/default-banner.jpg");

  // Fetch event data
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();

        setEventData(data);
        setImagePreview(data.image);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  // Handle text changes
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEventData({ ...eventData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const body = new FormData();

    // append non-empty values
    Object.keys(eventData).forEach((key) => {
      if (eventData[key]) body.append(key, eventData[key]);
    });

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        body,
      });

      if (res.ok) {
        alert("Event updated successfully!");
        navigate("/admin/dashboard");
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <p className="p-10 text-lg">Loading event...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 mb-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">Edit Event</h1>

        {/* Event Image */}
        <div className="w-full mb-10">
          <img
            src={imagePreview}
            alt="Event Banner"
            className="w-full h-56 object-cover rounded-xl shadow-lg border-4 border-white"
          />

          <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
            Change Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 
              file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:text-sm file:font-semibold 
              file:bg-pink-50 file:text-pink-700 
              hover:file:bg-pink-100"
          />
        </div>

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            ></textarea>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-12 flex gap-4">
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl 
            hover:bg-green-700 transition shadow-lg"
          >
            Save Changes
          </button>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-8 py-4 border-2 border-gray-400 text-gray-700 font-bold text-lg rounded-xl 
            hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminEventEdit;
