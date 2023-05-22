const Adminmodel = require('../model/Admin-model');
const bcrypt = require('bcryptjs')
const admin_router = require('express').Router();
const jwt = require('jsonwebtoken');
const movie_router = require('./Movie-controller');
const Moviemodel = require('../model/Movie-model');

//post
admin_router.post('/signup', async (req, res, next) => {  //localhost:5000/admin/signup
    const {
        email,
        password,
    } = req.body;
    if (!email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs"
        })
    }
    let existingAdmin;
    try {
        existingAdmin = await Adminmodel.findOne({ email });
    } catch (err) {
        return console.log(err)
    }
    if (existingAdmin) {
        return res.status(500).json({
            Message: "Admin already exist"
        })
    }
    let admin;
    const hashedPassword = bcrypt.hashSync(password)
    try {
        admin = new Adminmodel({ email, password: hashedPassword })
        admin = await admin.save();
    } catch (err) {
        return console.log(err)
    }
    if (!admin) {
        return res.status(400).json({
            message: "Unable to store admin"
        })
    }
    return res.status(201).json({ admin })

});


admin_router.post('/login', async(req, res, next) => {    //localhost:5000/admin/login
    const {
        email,
        password,
    } = req.body;

    
    let existingadmin;
    try{
        existingadmin = await Adminmodel.findOne({email});
    }catch(err){
        return console.log(err)
    }

    if(!existingadmin){
        return res.status(500).json({
            message:"Account is not valid"
        })
    }
    const ispasswordcorrect = bcrypt.compareSync(password,existingadmin.password);
    if(!ispasswordcorrect){
        return res.status(400).json({
            message:"password is not valid"
        })
    }
    const token = jwt.sign({id:existingadmin._id},process.env.SECRET_KEY,{
        expiresIn: "7d",
    })
    return res.status(200).json({
        message:"Login successfully",token,id:existingadmin._id
    })
})


admin_router.get('/:id',async (req,res,next)=>{
    const id = req.params.id;
    let movies;
    try{
        movies = await Adminmodel.findById(id).populate('Addedmovies')
    }catch(err){
        return console.log(err)
    }
    if(!movies){
        return res.status(404).json({  
            message:"Invalid movie ID"
        })
    }
    return res.status(200).json({movies})
})


//get all admins

admin_router.get('/getadmins',async (req,res,next)=>{
       let admins;
       try{
        admins = await Adminmodel.find()
       }catch(err){
        return console.log(err)
       }

       if(!admins){
        return res.status(500).json({
            message:"Internal Server Error"
        })
       }
       return res.status(200).json({admins,
        message:"successfully get the data"
       })

})


module.exports = admin_router;