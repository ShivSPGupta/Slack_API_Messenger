import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [messageTs, setMessageTs] = useState("");

  const handleSendOrSchedule = async () => {
    try {
      if (scheduleDate && scheduleTime) {
        const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        const postAt = Math.floor(scheduleDateTime.getTime() / 1000);
        const res = await axios.post(`${API}/schedule`, { message, postAt });
        setMessageTs(res.data.scheduled_message_id);
        setResponse(
          `\u2705 Scheduled successfully.\nScheduled Message ID: ${res.data.scheduled_message_id}`
        );
      } else {
        const res = await axios.post(`${API}/send`, { message });
        setMessageTs(res.data.ts);
        setResponse(
          `\u2705 Message sent successfully.\nMessage ID (ts): ${res.data.ts}`
        );
      }
    } catch (err) {
      setResponse(err.response?.data?.error || "Send/Schedule error");
    }
  };

  const handleRetrieve = async () => {
    try {
      const payload = messageTs ? { ts: messageTs } : {};
      const res = await axios.post(`${API}/retrieveById`, payload);

      if (res.data && res.data.message && res.data.ts) {
        setMessageTs(res.data.ts);
        setResponse(
          `📩 Message: ${res.data.message.text}\nMessage ID (ts): ${res.data.ts}`
        );
      } else {
        setResponse("⚠️ Message retrieved but data was incomplete.");
      }
    } catch (err) {
      const apiError = err.response?.data?.error;
      setResponse(apiError ? `❌ ${apiError}` : "❌ Retrieve error");
    }
  };

  const handleEdit = async () => {
    try {
      if (!messageTs)
        return setResponse(
          "\u26a0\ufe0f No message to edit. Use retrieve/send first."
        );
      const res = await axios.post(`${API}/edit`, { message, ts: messageTs });
      setResponse(
        `\u2705 Message edited successfully.\nNew Text: ${res.data.text}\nEdited Message ID: ${res.data.ts}`
      );
    } catch (err) {
      setResponse(err.response?.data?.error || "Edit error");
    }
  };

  const handleDelete = async () => {
    try {
      if (!messageTs)
        return setResponse(
          "\u26a0\ufe0f No message to delete. Use retrieve/send first."
        );
      const res = await axios.delete(`${API}/delete`, {
        data: { ts: messageTs },
      });
      setResponse(
        `\u274c Message deleted successfully.\nDeleted Message ID: ${res.data.ts}`
      );
      setMessageTs("");
    } catch (err) {
      setResponse(err.response?.data?.error || "Delete error");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Slack Message Manager</h1>

      <input
        className="border p-2 w-full mb-3 rounded"
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <input
          type="date"
          className="border p-2 rounded"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
        />
        <input
          type="time"
          className="border p-2 rounded"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
        />
      </div>
      <input
        className="border p-2 w-full mb-3 rounded"
        type="text"
        placeholder="Enter message ID (ts) to retrieve or leave blank"
        value={messageTs}
        onChange={(e) => setMessageTs(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleSendOrSchedule}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send / Schedule
        </button>
        <button
          onClick={handleRetrieve}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Retrieve
        </button>
        <button
          onClick={handleEdit}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {response || "Response will appear here..."}
      </pre>
    </div>
  );
}
