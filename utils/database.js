const mongoose = require('mongoose');
function dbconnc(){
    mongoose.connect("mongodb+srv://susovan6:venom2000@cluster0.e0bma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
      

        const db = mongoose.connection;
        db.on('error',console.error.bind(console,'connection error:'));
        db.once('open',function(){
            console.log('Connected')
        });

}
module.exports=dbconnc;