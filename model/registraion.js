const mongoose = require("mongoose")

const ExploreNewSchema = new mongoose.Schema({

fname:{
    type:String,
    require:true
},
lname:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true,
    min:8
},

gender:{
    type:String,
    required:true
},

email:{
    type:String,
    required:true,
    unique:true

},
txtEmpPhone:{
    type:Number,
    required:true,
    unique:true
},

select:{
    type:String,
    required:true
},
answer:{
    type:String,
    required:true
},



})
module.exports = mongoose.model('Employeesregister', ExploreNewSchema);
