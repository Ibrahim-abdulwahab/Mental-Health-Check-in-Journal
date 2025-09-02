const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating the prompt Schema

const promptSchema = new Schema({
    //prompt attrubutes
        title : { type: String, required: true, maxLength: 20, trim: true}, //short title for the prompt
        text : {type: String, required: true, maxLength: 250, trim: true}, //the actual journaling/ question
        category: {type: String, enum : ['self-reflection', 'gratitude','stress', 'mindfulness', 'awareness', 'growth', 'general'], default: 'general'},
        moodID: {type: Schema.Types.ObjectId, ref: 'journalEntry'}, //linking to mood/ journal entry
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    // Delivery Attributes
    deliveryAttributes: {
        frequency: {type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily'},
        targetAudience: { type: String, enum: ['user', 'professional', 'all'], default: 'user' },
        tags: {type: String, maxLength: 20, default: 'general'},
    },

    //response Attributes
    responseAttributes: {
        isMandatory: {type: Boolean, default: false},
        expectedFormat: {type: String, enum: ['text', 'checklist', 'scale', 'multiple-choice'], default: 'text'},
        suggestedDuration: {type: Number },

    },
            
},
{timestamps: true});

module.exports = mongoose.model('Prompt', promptSchema);