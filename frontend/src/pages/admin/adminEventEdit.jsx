import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import api from "../../services/api";
import logo from "../../assets/images/cover.jpg";

const AdminEventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    date: "",
    time: "",
    location: "",
    max_attendees: "",
    price: 0,
    event_cover: null,
  });

  const [imagePreview, setImagePreview] = useState(logo);

  // ✅ FETCH SINGLE EVENT BY ID (FIXED)
  useEffect(() => {
    const fetchSingleEvent = async () => {
      try {
        const res = await api.get(`event/edit/${id}`);
        const data = res.data;

        const isoDate = new Date(data.date_time);

        setFormData({
          title: data.title || "",
          desc: data.desc || "",
          date: isoDate.toISOString().split("T")[0],
          time: isoDate.toTimeString().slice(0, 5),
          location: data.location || "",
          max_attendees: data.max_attendees || "",
          price: data.price || 0,
          event_cover: null,
        });

        setImagePreview(data.event_cover || logo);
      } catch (err) {
        console.error("Error loading event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData({ ...formData, event_cover: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const body = new FormData();

    const dateTime = `${formData.date}T${formData.time}:00Z`;

    body.append("title", formData.title);
    body.append("desc", formData.desc);
    body.append("date_time", dateTime);
    body.append("location", formData.location);
    body.append("max_attendees", formData.max_attendees);
    body.append("price", formData.price);

    if (formData.event_cover) {
      body.append("event_cover", formData.event_cover);
    }

    try {
      const res = await api.put(`event/update/${id}/`, body, {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ THIS FIXES IMAGE UPLOAD
        },
      });

      if (res.status === 200) {
        alert("Event updated successfully!");
        navigate("/admin/dashboard");
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Something went wrong.");
    }
  };
  if (loading) return <p className="p-10 text-lg">Loading event...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 mb-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">Edit Event</h1>

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

        {/* ✅ FORM FIELDS */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* TITLE */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* TIME */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* LOCATION */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ✅ BUTTONS */}
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
