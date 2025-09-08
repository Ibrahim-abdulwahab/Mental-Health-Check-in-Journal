const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const habittrackerSchema = new Schema({

  userId: { type: String, ref: 'User', required: true },
  habitType: { type: String, required: true },
  startDate: { type: Date, required: true },
  frequency: { enum: ['daily', 'weekly', 'monthly'], type: String, required: true },
  status: { enum: ['active', 'completed', 'paused'], type: String, default: 'active' },

  trackingAttributes: {
    duration: { type: Number, required: true }, // in minutes
    intensity: { enum: ['low', 'medium', 'high'], type: String, required: true },
    completionRate: { type: Number, min: 0, max: 100, required: true }, // percentage of consistency
    streakCount: { type: Number, required: true } // number of consecutive completions
  },
  impactAttributes: {
    linkedMoodId: { type: String, ref: 'MoodTracker', required: false },
    impactOnMood: { enum: ['improved', 'neutral', 'worsened'], type: String, required: false },
    notes : { type: String, required: false }
  },



}
, { timestamps: true } // adds createdAt and updatedAt fields
);
module.exports = mongoose.model('habittracker', habittrackerSchema);