import { useState } from "react";
import { sendBroadcastMessage } from "../../../../services/broadcastService";

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  causeId: string;
  onSuccess?: () => void;
}

export default function BroadcastModal({
  isOpen,
  onClose,
  causeId,
  onSuccess,
}: BroadcastModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await sendBroadcastMessage({ causeId, message });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Broadcast failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Send Broadcast Message</h2>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Type your message"
        />
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 bg-[#006837] text-white rounded"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
