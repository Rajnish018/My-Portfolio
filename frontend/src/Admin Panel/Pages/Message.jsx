import { useEffect, useState } from "react";
import axios from "axios";
import { FiCheckCircle, FiTrash2, FiX, FiMail } from "react-icons/fi";


const BASE_URL=import.meta.env.VITE_API_BASE_URL


function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showPane, setShowPane] = useState(false);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(`${BASE_URL}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data?.data?.messages ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const api = (method, url) => {
    const token = localStorage.getItem("adminToken");
    return axios({ method, url, headers: { Authorization: `Bearer ${token}` } });
  };

  const markAsRead = async (id) => {
    try { 
      await api("patch", `${BASE_URL}/admin/messages/${id}/read`); 
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)));
    } catch (err) { 
      console.error(err); 
    }
  };

  const markUnread = async (id) => {
    try { 
      await api("patch", `${BASE_URL}/admin/messages/${id}/unread`); 
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, isRead: false } : m)));
    } catch (err) { 
      console.error(err); 
    }
  };

  const deleteMessage = async (id) => {
    try { 
      await api("delete", `${BASE_URL}/admin/messages/${id}`); 
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected?._id === id) setShowPane(false);
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleOpen = async (msg) => {
    setSelected(msg);
    setShowPane(true);
    if (!msg.isRead) await markAsRead(msg._id);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Contact Messages</h2>

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No messages found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const initial = msg.name?.charAt(0)?.toUpperCase() || "?";
            return (
              <div
                key={msg._id}
                onClick={() => handleOpen(msg)}
                className={`border rounded-lg p-4 shadow-sm cursor-pointer transition flex gap-3 items-center
                  ${msg.isRead ? "border-gray-300 bg-white" : "border-indigo-500 bg-indigo-50"}
                  hover:bg-gray-100`}
              >
                {/* Avatar circle */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  {initial}
                </div>

                {/* Message meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-indigo-800 truncate">{msg.name}</p>
                      <p className="text-sm text-gray-600 truncate">{msg.email}</p>
                    </div>

                    <div className="flex gap-3 flex-shrink-0">
                      {!msg.isRead && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markAsRead(msg._id); }}
                          className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                        >
                          <FiCheckCircle size={18} /> <span className="hidden sm:inline">Mark</span>
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMessage(msg._id); }}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <FiTrash2 size={18} /> <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over panel */}
      {showPane && selected && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPane(false)}
          />

          <div className="relative ml-auto w-full max-w-lg bg-white shadow-xl flex flex-col h-full">
            {/* header / toolbar */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                  {(selected.name?.charAt(0) || "?").toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-indigo-800 leading-tight">{selected.name}</p>
                  <p className="text-sm text-gray-600 leading-tight">{selected.email}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                {selected.isRead && (
                  <button
                    onClick={async () => {
                      await markUnread(selected._id);
                      setSelected((p) => ({ ...p, isRead: false }));
                    }}
                    className="text-gray-600 hover:text-indigo-600"
                    title="Mark Unread"
                  >
                    <FiMail size={18} />
                  </button>
                )}
                <button
                  onClick={() => { deleteMessage(selected._id); setShowPane(false); }}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FiTrash2 size={18} />
                </button>
                <button
                  onClick={() => setShowPane(false)}
                  className="text-gray-600 hover:text-gray-800"
                  title="Close"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="p-6 overflow-y-auto whitespace-pre-line text-gray-800 flex-1">
              {selected.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;