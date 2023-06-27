const bookingmodel = require("../model/Booking-model");
const usermodel = require("../model/user-model");
const user_router = require("express").Router();
const bycrypt = require('bcryptjs');

//get
user_router.get('/getalluser', async (req, res, next) => {   //localhost:5000/user/getalluser
    
    let users;
    try {
        users = await usermodel.find()
    } catch (err) {
        return next(err)
    }
    if (!users) {
        return res.status(500).json({
            message: "unexpected error occured"
        })
    }
    return res.status(200).json({ users })
})


//post
user_router.post('/signup',async (req, res, next) => {  //localhost:5000/user/signup
    const {
        name,
        email,
        password
    } = req.body;
    if (!name && name.trim() === "" && !email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs"
        })
    }

     
    const hashedPassword = bycrypt.hashSync(password)

       let newUser;
       try{
        newUser = new usermodel({
            name,
            email,
            password: hashedPassword
        });
        newUser =await newUser.save()
       }catch(err){return console.log(err)}
      if(!newUser){
        return res.status(500).json({message:"unexpected error occured"})

      }
      return res.status(201).json({
        id:newUser._id  
      })
      
})

//update
user_router.put('/getuser/:id', async (req, res, next) => {     //localhost:5000/user//getuser/:id

    const id = req.params.id
    const {
        name,
        email,
        password
    } = req.body;
    if (!name && name.trim() === "" && !email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs"
        })
    }
    const hashedPassword = bycrypt.hashSync(password)
    let user;
    try {
        user = await usermodel.findByIdAndUpdate(id, { name, email, password: hashedPassword })
    } catch (err) {
        return console.log(err)
    }
    if (!user) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
    return res.status(200).json({
        message: "Updated Successfully"
    })
})

//Delete the user

user_router.delete('/:id', async (req, res, next) => {   //localhost:5000/user/:id
    const id = req.params.id;
    let user;
    try {
        user = await usermodel.findByIdAndRemove(id)
    } catch (err) {
        return console.log(err)
    }
    if (!user) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
    return res.status(200).json({
        message: "Removed Successfully"
    })
})

user_router.post("/user/login", async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    if (!email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({
            message: "Invalid inputs"
        })
    }

    //Finding the user he is already signin or not    
    let existinguser;
    try {
        existinguser = await usermodel.findOne({ email })
    } catch (err) {
        return console.log(err)
    }
    if (!existinguser) {
        return res.status(404).json({
            message: "Unable to find the user from this id"
        })
    }

    //checking the password is correct or not 
    const ispasswordcorrect = bycrypt.compareSync(password, existinguser.password)
    if (!ispasswordcorrect) {
        return res.status(400).json({
            message: "Incorrect password"
        })
    }
    return res.status(201).json({
        id:existinguser._id,
        message: "Login Successfully",
    })
})

user_router.get("/getusersbooking/:id",async (req,res,next)=>{
     const id = req.params.id
     let bookings;
     try{
       bookings = await bookingmodel.find({user:id}).populate('user movie').lean()
     }catch(err){
        return console.log(err)
     }
     if(!bookings){
        return res.status(500).json({message:"unable to get booking"})

     }
     return res.status(201).json({bookings})
})
user_router.get('/:id', async (req, res, next) => {   //localhost:5000/user/:id
    const id =req.params.id;
    let user;  
    try {
        user = await usermodel.findById(id)
    } catch (err) {
        return next(err)
    }
    if (!user) {
        return res.status(500).json({
            message: "unexpected error occured"
        })
    }
    return res.status(200).json({ user })
})

module.exports = user_router;