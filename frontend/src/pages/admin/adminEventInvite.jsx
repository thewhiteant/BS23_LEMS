import { useState } from "react";
import AdminMenu from "../../components/adminMenu";
import Footer from "../../components/footer";

const AdminEventInvite = () => {
  const [eventId, setEventId] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");

  const generateInvite = async () => {
    if (!eventId) return alert("Please enter event ID.");

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/invite/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId }),
      });

      const data = await res.json();
      if (res.ok) setInviteLink(data.link);
      else alert(data.error || "Failed to generate link.");
    } catch {
      alert("Server error.");
    }
    setLoading(false);
  };

  const sendEmail = async () => {
    if (!email) return alert("Enter a user email first.");
    if (!inviteLink) return alert("Generate an invite link first.");

    setEmailStatus("sending");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/invite/send/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, link: inviteLink }),
      });

      if (res.ok) setEmailStatus("success");
      else setEmailStatus("failed");
    } catch {
      setEmailStatus("failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 flex justify-end">
        <AdminMenu />
      </div>

      {/* Added mb-20 here */}
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-6 mb-20">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Invite Link Generator
        </h1>

        {/* EVENT ID */}
        <label className="block mb-2 font-semibold">Event ID</label>
        <input
          type="number"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          placeholder="Enter event ID..."
          className="w-full border p-3 rounded-xl mb-4"
        />

        <button
          onClick={generateInvite}
          className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 
                     text-white font-bold text-lg rounded-xl hover:scale-105 
                     transition shadow-lg"
        >
          {loading ? "Generating..." : "Generate Invite Link"}
        </button>

        {/* GENERATED LINK */}
        {inviteLink && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-xl">
            <p className="font-semibold text-gray-600">Generated Link:</p>
            <p className="mt-2 break-all text-blue-700">{inviteLink}</p>

            <button
              onClick={() => navigator.clipboard.writeText(inviteLink)}
              className="mt-4 w-full px-8 py-3 bg-gray-800 text-white rounded-xl 
                         hover:scale-105 transition shadow-lg"
            >
              Copy Link
            </button>
          </div>
        )}

        {/* SEND EMAIL */}
        {inviteLink && (
          <div className="mt-8">
            <label className="block mb-2 font-semibold">Send to Email</label>
            <input
              type="email"
              placeholder="Enter user email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-xl mb-4"
            />

            <button
              onClick={sendEmail}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 
                         text-white font-bold text-lg rounded-xl hover:scale-105 
                         transition shadow-lg"
            >
              Send Invite Email
            </button>

            {emailStatus === "sending" && (
              <p className="text-blue-600 mt-3">Sending...</p>
            )}
            {emailStatus === "success" && (
              <p className="text-green-600 mt-3">Email Sent Successfully!</p>
            )}
            {emailStatus === "failed" && (
              <p className="text-red-600 mt-3">Failed to Send Email.</p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminEventInvite;
