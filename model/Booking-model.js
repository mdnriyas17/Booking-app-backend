const mongoose = require('mongoose');


const booking_schema =new mongoose.Schema({
    movie:{
        type: mongoose.Schema.ObjectId,
        ref:"Movie",
        default:[]
        
    },
    date:{
        type: Date,
        required: true
    },
    seatnumber:{
        type: String,
        required: true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        default:[]    
    }
        
    

})

const bookingmodel = mongoose.model('test-booking',booking_schema);
module.exports = bookingmodel;