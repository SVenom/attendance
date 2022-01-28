const mongoose =  require("mongoose")

const ExploreNewSchema = new mongoose.Schema({
    day:{
        type:String,
        required:true
    },
    month:{
        type:String,
        required:true
    },
    year:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    isPresent:{
        type:String,
        required:true
    }
})
module.exports =mongoose.model('Attendance', ExploreNewSchema);
