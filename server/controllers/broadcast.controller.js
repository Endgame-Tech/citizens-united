import Broadcast from "../models/broadcast.model.js";
import Cause from "../models/cause.model.js";
import Notification from "../models/notification.model.js";

export const sendBroadcast = async (req, res) => {
  const { causeId, message } = req.body;
  const sentBy = req.userId; // extracted from token via middleware

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const cause = await Cause.findById(causeId).populate("supporters");
    if (!cause) {
      return res.status(404).json({ message: "Cause not found" });
    }

    // Save the broadcast
    const newBroadcast = await Broadcast.create({ causeId, message, sentBy });

    // Notify all supporters except the sender
    const filteredSupporters = cause.supporters.filter(
      (supporter) => supporter._id.toString() !== sentBy
    );

    const notifications = await Promise.all(
      filteredSupporters.map((supporter) =>
        Notification.create({
          recipient: supporter._id,
          type: "broadcast",
          title: `New message from "${cause.name} Cause"`,
          message,
          relatedCause: cause._id,
        })
      )
    );

    return res.status(201).json({ broadcast: newBroadcast, notifications });
  } catch (error) {
    console.error("Broadcast error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getBroadcasts = async (req, res) => {
  const { causeId } = req.params;
  const broadcasts = await Broadcast.find({ causeId }).sort({ createdAt: -1 });
  res.status(200).json(broadcasts);
};

