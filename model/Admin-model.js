const mongoose = require('mongoose');


 const Admin_schema =new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    Addedmovies:[{
          type:mongoose.Types.ObjectId,
          ref: "Movie",
          required:true
    }]
})
const Adminmodel = mongoose.model('test',Admin_schema);
module.exports = Adminmodel;