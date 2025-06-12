import Notification from "../models/notification.model.js";
import Cause from "../models/cause.model.js";

/**
 * Send a broadcast message to all supporters in a cause.
 */
// export const sendBroadcastNotification = async (req, res) => {
//   try {
//     const { causeId, message } = req.body;
//     const userId = req.userId;

//     if (!causeId || !message) {
//       return res.status(400).json({ message: "causeId and message are required" });
//     }

//     const cause = await Cause.findById(causeId).populate("supporters");

//     if (!cause) {
//       return res.status(404).json({ message: "Cause not found" });
//     }

//     if (!Array.isArray(cause.supporters) || cause.supporters.length === 0) {
//       return res.status(400).json({ message: "No supporters found in this cause" });
//     }

//     const notifications = await Promise.all(
//       cause.supporters.map((supporter) =>
//         Notification.create({
//           recipient: supporter._id,
//           type: "broadcast",
//           title: `New message from "${cause.name}"`,
//           message,
//           relatedCause: cause._id,
//           sender: userId, // optional: track who sent it
//         })
//       )
//     );

//     return res.status(200).json({ message: "Broadcast sent", count: notifications.length });
//   } catch (error) {
//     console.error("Broadcast error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

/**
 * Get notifications for the authenticated user.
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json(notifications);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/**
 * Mark a specific notification as read.
 */
export const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { read: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found or unauthorized" });
    }

    res.status(200).json({ message: "Marked as read", notification: updated });
  } catch (err) {
    console.error("Mark as read error:", err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};


export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
