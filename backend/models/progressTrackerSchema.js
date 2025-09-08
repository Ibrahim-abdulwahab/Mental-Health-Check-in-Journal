import mongoose from "mongoose";

const ProgressTrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },

  moodSummary: {
    averageMoodRating: { type: Number, min: 1, max: 10 },
    mostFrequentEmotions: [{ type: String }],
    moodTrends: [{ type: String }], 
  },

  journalSummary: {
    totalEntries: { type: Number, default: 0 },
    entriesWithPrompts: { type: Number, default: 0 },
    mostUsedTags: [{ type: String }],
    reflectionNotes: [{ type: String }],
  },

  habitSummary: {
    trackedHabits: [{ type: String }], 
    completionRates: [{ type: Number, min: 0, max: 100 }], 
    streaks: [{ type: Number }], 
    impactOnMood: [{ type: String }],
  },

  insights: [{ type: String }], 
  recommendations: [{ type: String }],
});

export default mongoose.model("ProgressTracker", ProgressTrackerSchema);
