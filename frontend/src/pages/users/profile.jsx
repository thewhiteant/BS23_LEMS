import { useState, useEffect } from "react";
import Footer from "../../components/footer";
import api from "../../services/api";
import default_icon from "../../assets/default_icon.png";

const ProfilePage = () => {
  // ------------------ PROFILE STATE (from API) ------------------
  const [profile, setProfile] = useState(null);

  // ------------------ EDITING STATE ------------------
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(default_icon);

  const [originalData, setOriginalData] = useState(null);

  // ------------------ FETCH PROFILE ------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("user/profile/");
        setProfile(res.data);

        setFormData({
          username: res.data.username,
          phone: res.data.phone,
          profile_image: null,
        });

        setImagePreview(res.data.profile_image || default_icon);
        setOriginalData(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div className="p-10 text-center">Loading...</div>;

  // ------------------ HANDLE INPUT CHANGE ------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_image" && files && files[0]) {
      setFormData({ ...formData, profile_image: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ------------------ EDIT ------------------
  const handleEdit = () => {
    setIsEditing(true);
  };

  // ------------------ CANCEL ------------------
  const handleCancel = () => {
    setFormData({
      username: originalData.username,
      phone: originalData.phone,
      profile_image: null,
    });

    setImagePreview(originalData.profile_image || default_icon);
    setIsEditing(false);
  };
  const handleSubmit = async () => {
    const body = new FormData();
    body.append("username", formData.username);
    body.append("phone", formData.phone);

    if (formData.profile_image) {
      body.append("profile_image", formData.profile_image);
    }

    try {
      const res = await api.patch("user/profile/", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated successfully!");

      // Update profile state
      setProfile(res.data);
      setOriginalData(res.data);
      setIsEditing(false);

      // ------------------ UPDATE LOCAL STORAGE ------------------
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = { ...storedUser, ...res.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 mb-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">My Profile</h1>

        {/* ------------------ PROFILE IMAGE ------------------ */}
        <div className="flex items-center gap-8 mb-10">
          <img
            src={imagePreview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
          />

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Profile Picture
              </label>
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm"
              />
            </div>
          )}
        </div>

        {/* ------------------ FORM ------------------ */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Username
            </label>

            {isEditing ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">
                {profile.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <p className="text-lg bg-gray-50 px-4 py-3 rounded-xl">
              {profile.email}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Phone
            </label>

            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">
                {profile.phone || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Events */}
        <div className="mt-10 bg-pink-50 p-6 rounded-xl">
          <label className="block text-gray-700 font-medium mb-1">
            Events Attended
          </label>
          <p className="text-2xl font-bold text-pink-700">
            {profile.attend_number_of_event} event
            {profile.attend_number_of_event !== 1 && "s"}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="mt-12 flex gap-4">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-8 py-4 bg-pink-600 text-white font-bold text-lg rounded-xl"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl"
              >
                Save Changes
              </button>

              <button
                onClick={handleCancel}
                className="px-8 py-4 border-2 border-gray-400 text-gray-700 font-bold text-lg rounded-xl"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
