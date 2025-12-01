import { useState } from "react";
import Footer from "../../components/footer";

const ProfilePage = ({ user }) => {
  const safeUser = user || {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    attend_number_of_event: 0,
    profile_image: "",
  };

  const [isEditing, setIsEditing] = useState(false);

  // Backup original data (for Cancel)
  const [originalData] = useState({ ...safeUser });

  // Editable form fields
  const [formData, setFormData] = useState({
    first_name: safeUser.first_name,
    last_name: safeUser.last_name,
    phone: safeUser.phone,
    profile_image: null,   // File object or null
    password: "",
  });

  // Image preview URL
  const [imagePreview, setImagePreview] = useState(
    safeUser.profile_image || "/default-profile.png"
  );

  // Handle all input changes (text + file)
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_image" && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, profile_image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Start editing
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel → restore everything
  const handleCancel = () => {
    setFormData({
      first_name: originalData.first_name,
      last_name: originalData.last_name,
      phone: originalData.phone,
      profile_image: null,
      password: "",
    });
    setImagePreview(originalData.profile_image || "/default-profile.png");
    setIsEditing(false);
  };

  // Submit form
  const handleSubmit = async () => {
    const body = new FormData();

    // Only append non-empty values
    if (formData.first_name) body.append("first_name", formData.first_name);
    if (formData.last_name) body.append("last_name", formData.last_name);
    if (formData.phone) body.append("phone", formData.phone);
    if (formData.profile_image) body.append("profile_image", formData.profile_image);
    if (formData.password) body.append("password", formData.password);

    try {
      const res = await fetch("/api/user/update-profile/", {
        method: "PUT",
        body,
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        // Optional: refresh page or update user context
        window.location.reload();
      } else {
        const error = await res.text();
        alert("Update failed: " + error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 mb-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">My Profile</h1>

        {/* Profile Image */}
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
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="First name"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">
                {safeUser.first_name || "—"}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Last name"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">
                {safeUser.last_name || "—"}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">
              {safeUser.email}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Phone number"
              />
            ) : (
              <p className="text-lg text-gray-800 font-medium">
                {safeUser.phone || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Events Attended */}
        <div className="mt-10 bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-xl">
          <label className="block text-gray-700 font-medium mb-1">Events Attended</label>
          <p className="text-2xl font-bold text-pink-700">
            {safeUser.attend_number_of_event} event{safeUser.attend_number_of_event !== 1 && "s"}
          </p>
        </div>

        {/* Change Password (only in edit mode) */}
        {isEditing && (
          <div className="mt-10 border-t pt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Change Password (Optional)
            </h3>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="mt-12 flex gap-4">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition shadow-lg"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 transition shadow-lg"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-8 py-4 border-2 border-gray-400 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-50 transition"
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