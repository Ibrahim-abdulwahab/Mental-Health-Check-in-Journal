const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MoodTrackerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    mood: {
      type: String,
      required: [true, "Mood is required"],
      enum: ["happy", "sad", "angry", "neutral", "stressed", "excited"],
    },
    note: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],
    entryDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MoodTracker", MoodTrackerSchema);
