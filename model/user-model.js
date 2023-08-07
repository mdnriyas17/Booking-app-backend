const mongoose = require('mongoose');


const user_schema =new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    bookings:[{
        type:mongoose.Types.ObjectId,
        ref:"booking",
        required:true
    }]
})

const usermodel = mongoose.model('test-user',user_schema);
module.exports = usermodel;