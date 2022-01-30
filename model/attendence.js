const mongoose =  require("mongoose")

const ExploreNewSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:false
    },
    day:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true

    },
    isPresent:{
        type:String,
        required:true
    }
})
module.exports =mongoose.model('Attendance', ExploreNewSchema);
