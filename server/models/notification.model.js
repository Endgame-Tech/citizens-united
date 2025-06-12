import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["broadcast", "invite", "supporterUpdate", "system"],
      required: true,
    },
    title: String,
    message: {
      type: String,
      required: true,
    },
    relatedCause: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cause",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);