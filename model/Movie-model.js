const mongoose = require('mongoose');



const Movie_schema =new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    actors:[{
        type:String,
        required:true
    }],
    description:{
        type: String,
        required: true
    },
    releasedate:{
        type: Date,
        required: true
    },
    posterurl:{
        type: String,
        required: true
    },
    featured:{
        type: Boolean,
    },
    bookings:[{
        type: mongoose.Types.ObjectId,
        ref:"booking",
    }],
    admin:[{
        type:mongoose.Types.ObjectId,
        ref: "Admin",
        
     }]
})

const Moviemodel = mongoose.model('test-movie',Movie_schema);
module.exports = Moviemodel;