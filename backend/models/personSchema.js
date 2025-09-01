const mongoose = require('mongoose');
const Schema = mongoose.Schema

//creating the person schema
const personSchema = new Schema ({
    name:{type: String , required: true, trim: true},
    email : {type: String , required: true, unique: true, lowercase: true, trim: true},
    passwordHash:{type: String, required: true},
    role:{
        type: String , 
        enum:['admin','user', 'professional'], 
        default:'user'
    },
    status:{
        type: String ,
         enum:['active','inactive', 'suspended'],
          default:'active'
        },
    age:{type: Number, min:1},
    gender:{type: String ,
         enum:['male', 'female','prefer not to say']
        },
    timezone:{type: String},
        // Role-specific fields
    user: {
        goal: {type: String, default:[]},
        preferences:{
            Notifications :{type: Boolean, default: true},
            reminders:{type: Boolean, default: true},
            privacyLevel:{type:String , enum:['private','sharedWithProfessional','public'], default:'private'}
        }
    },


    professional: {
        specialization: {type: String},
        qualifications :{type: String},
        licenceNumber:{type: String},
        yearsOfExperience:{type: Number, min:0},
        availablility:{
            day:{type: String, enum:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']},
            timeSlots :{type: String} // e.g., "9am-11am, 2pm-5pm"
        },
        consultationTypes:{
            type: String,
            enum:['chat','video','in-person'],
        }
    },
    admin:{
        permissions:{
            type: String,
            enum:['manageUsers','manageContent','manageProfessionals', 'viewAnalitics', 'systemConfig'],
            lastLogin:{type: Datetime},
        }
    }
}); 

//Middleware to update the updatedAt field before saving
personSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next();

},
{ timestamps: true }
);

//create the model and export it
module.exports = mongoose.model('Person', personSchema);

