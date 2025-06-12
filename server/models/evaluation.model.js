import mongoose from "mongoose";

const EvaluationSchema = new mongoose.Schema({
  assessor: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    organisation: { type: String },
    state: { type: String, required: true },
    votingExperience: {
      type: String,
      enum: ["First-time voter", "Con-current voter", "Not Interested in voting"],
      required: true
    },
    designation: {
      type: String,
      enum: [
        "Electoral Commission Official",
        "Political Party Representative",
        "Civil Society Organisation Representative",
        "Academic/Researcher",
        "Independent Evaluator",
        "Citizen",
        "Other"
      ],
      required: true
    },
    otherDesignation: { type: String } // Optional if "Other" is selected
  },
  candidate: {
    candidateName: { type: String, required: true },
    position: { type: String, required: true },
    party: { type: String }, // Optional
    state: { type: String, required: true }
  },
  scores: {
    capacity: { type: Number, required: true, min: 0, max: 100 }, // % of 30
    competence: { type: Number, required: true, min: 0, max: 100 }, // % of 30
    character: { type: Number, required: true, min: 0, max: 100 }, // % of 40
  },
  finalScore: { type: Number, required: true, min: 0, max: 100 }, // Stored at submission
  createdAt: { type: Date, default: Date.now }  // UTC timestamp
});

export default mongoose.model("Evaluation", EvaluationSchema);

