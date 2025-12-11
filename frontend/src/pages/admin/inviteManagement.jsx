import { useEffect, useState } from "react";
import AdminMenu from "../../components/adminMenu";
import Footer from "../../components/footer";
import api from "../../services/api";

const InviteManagement = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const res = await api.get("rsvp/invite-tokens/");
      setInvites(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load invites.");
    }
    setLoading(false);
  };

  const deleteInvite = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invite?")) return;
    try {
      await api.delete(`rsvp/invite-tokens/${id}/delete/`);
      setInvites(invites.filter((invite) => invite.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete invite.");
    }
  };

  const expireInvite = async (id) => {
    if (!window.confirm("Are you sure you want to expire this invite?")) return;
    try {
      await api.post(`rsvp/invite-tokens/${id}/expire/`);
      setInvites(
        invites.map((invite) =>
          invite.id === id ? { ...invite, expired: true } : invite
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to expire invite.");
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 flex justify-end">
        <AdminMenu />
      </div>

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-6 mb-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Invite Management
        </h1>

        {loading ? (
          <p>Loading invites...</p>
        ) : invites.length === 0 ? (
          <p className="text-gray-500">No invites generated yet.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-xl">
            <table className="min-w-full border border-gray-200 rounded-xl divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    Used
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    Expired
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    RSVPs
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {invite.event_title}
                    </td>
                    <td
                      className="px-6 py-4 text-gray-800 break-all"
                      title={invite.token}
                    >
                      {invite.token}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(invite.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {invite.is_used ? "✅" : "❌"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {invite.expired ? "⏰ Expired" : "✅ Active"}
                    </td>
                    <td className="px-6 py-4">
                      {invite.rsvps.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          {invite.rsvps.map((rsvp) => (
                            <li key={rsvp.id}>
                              {rsvp.used_by} ({rsvp.status})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">No RSVPs</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex flex-col gap-2">
                      <button
                        onClick={() => deleteInvite(invite.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold"
                      >
                        Delete
                      </button>
                      {!invite.expired && (
                        <button
                          onClick={() => expireInvite(invite.id)}
                          className="px-3 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition font-semibold"
                        >
                          Expire
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default InviteManagement;
