const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
//using the uuid package to generate unique ids
const {v4 : uuidv4} = require('uuid');

//creating the person schema
const personSchema = new Schema ({
    personId : {
        type: String ,
        default: uuidv4,
        index : true,
        unique: true
    },
    name:{type: String , required: true, trim: true},
    email : {type: String , required: true, unique: true, lowercase: true, trim: true},
    passwordHash:{type: String},
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
 refreshToken : [String], 
    user: {
        goal: {type: [String], default:[]},
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
        },
         lastLogin:{type: Date},
    }
},
{ timestamps: true }
);

//create the model and export it
module.exports = mongoose.model('Person', personSchema);

