const bookingmodel = require("../model/Booking-model");
const Moviemodel = require("../model/Movie-model");
const usermodel = require("../model/user-model");
const mongoose = require("mongoose")

const booking_router = require("express").Router();


//post
booking_router.post('/create', async (req, res, next) => {  //localhost:5000/booking/create
    const {
        movie,
        date,
        seatnumber,
        user
    } = req.body;

    let existingmovie;
    let existinguser;

    try {
        existingmovie = await Moviemodel.findById(movie);
        existinguser = await usermodel.findById(user)
    } catch (err) {
        return console.log(err)
    }
    if (!existingmovie) {
        return res.status(404).json({
            message: "Movie Not found with given Id"
        })
    }
    if (!existinguser) {
        return res.status(404).json({
            message: "User not found with given Id"
        })
    }

      let bookings;

    try {
         bookings = new bookingmodel({
            movie,
            date: new Date(`${date}`),
            seatnumber,
            user
        });
        const session =await mongoose.startSession();
        session.startTransaction()
        existinguser.bookings.push(bookings)
        existingmovie.bookings.push(bookings)
         await existingmovie.save({session:session});
         await existinguser.save({session:session});
         await bookings.save({session});
         session.commitTransaction();
    } catch (err) {
        return console.log(err)
    }

    if (!bookings) {
        return res.status(500).json({ message: "Unable to create bookings" })
    }
    return res.status(201).json({ bookings })
});

booking_router.get("/:id",async(req,res,next)=>{

       let bookings;
       const id =req.params.id
       try{
         bookings =  await bookingmodel.findById({_id:id}).populate('user movie').lean();
       }catch(err){
        return console.log(err)
       }

       if(!bookings){
        return res.status(500).json({   
            message:"There is No bookings data"
        })
       }
       return res.status(200).json({bookings})
})
booking_router.delete("/delete/:id",async (req,res,next)=>{
    const id = req.params.id;
     let booking;
     try{
        booking = await bookingmodel.findByIdAndRemove(id).populate('user movie');
        const session = await mongoose.startSession();
        session.startTransaction();
        await booking.user.bookings.pull(booking); 
        await booking.movie.bookings.pull(booking)
        await booking.movie.save({session});
        await booking.user.save({session});
        session.commitTransaction();
     }catch(err){
        return console.log(err)
     }
     if(!booking){
        return res.status(500).json({
            message:"Unable to delete"
        })
     }
      return res.status(201).json({
        message:"Booking Deleted"  
    })
})

module.exports = booking_router