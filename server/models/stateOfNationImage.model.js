import mongoose from "mongoose";

const stateOfNationImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Number, default: 0 },
    title: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("StateOfNationImage", stateOfNationImageSchema);