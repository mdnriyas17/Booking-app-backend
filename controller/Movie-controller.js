
const movie_router = require("express").Router();
const Adminmodel = require("../model/Admin-model");
const Moviemodel = require("../model/Movie-model");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')


//post
movie_router.post('/create',async  (req, res, next)=> {  //localhost:5000/movie/create


    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1]; 


        if (!token && token.trim() === "") {
            return res.status(422).json({
                message: "Token Not Found!!!" 
            })
        }   
        let adminId;
        // //verify token
    
        jwt.verify(token, process.env.SECRET_KEY, (err, decrypted) => {
            if (err) {
                return res.status(400).json({
                    messge: `${err.message}`
                });
            } else {
                adminId = decrypted.id;
                return;
            }
        })
        const {
            title,
            description,
            releasedate,
            posterurl,
            featured,
            actors
        } = req.body;
        if(!title &&title.trim()==="" &&
        !description&&description.trim()==="" &&
        !releasedate&&releasedate.trim()===""&&
        !posterurl&&posterurl.trim()==="" &&
        !actors&&actors.trim()===""){
            return res.status(422).json({message:"invalid inputs"})
        }
        let movie;
         try{
            
            movie = new Moviemodel({
            title,
            description,
            releasedate: new Date(`${releasedate}`),
            posterurl,
            featured,
            actors,
            admin:adminId
        });
         const session = await mongoose.startSession();
         const adminuser = await Adminmodel.findById(adminId);
         session.startTransaction();
         await movie.save({session:session});
         adminuser.Addedmovies.push(movie);
         await adminuser.save({session:session});
         await session.commitTransaction();
         }catch(err){
           return console.log(err)
         }
    
         if(!movie){
            return res.status(500).json({message:"Movie request failed"})
         }
         return res.status(200).json({movie})
    }
     
   

       
   

    
    
});




movie_router.get('/',async(req,res,next)=>{
    let movies
    try {
        movies = await Moviemodel.find().populate().lean()
    } catch (err) { 
        return next(err)
    }
    if (!movies) {
        return res.status(500).json({
            message: "unexpected error occured"
        })
    }
    return res.status(200).json({ movies })
})
movie_router.get('/:id',async(req,res,next)=>{
    let id = req.params.id;
    let movies;
    try {
        movies = await Moviemodel.findById(id).populate().lean()
    } catch (err) { 
        return next(err)
    }
    if (!movies) {
        return res.status(500).json({
            message: "unexpected error occured"
        })
    }
    return res.status(200).json({ movies })
})


module.exports = movie_router;

