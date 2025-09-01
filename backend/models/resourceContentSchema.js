const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resourceContentSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
        enum:["article", "video", "exercise"],
        required:true,
    },
    tags:{
        type:[String],
        required:true,
    },
    author:{
        type:String,
        required:true,
        trim:true,
    },
    targetAudience:{
        type:String,
        enum:["user","professtional","all"],
    },
},
{timestamps:true}
);

module.exports = mongoose.model("resourceContent",resourceContentSchema);