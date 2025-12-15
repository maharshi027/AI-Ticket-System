import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["To-Do", "In-Progress", "Done"],
      default: "To-Do",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    deadline: {
      type: Date,
    },

    helpfulNotes: {
      type: String,
    },

    relatedSkills: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
