const express = require("express");
const bodyparser = require("body-parser");
const node_server = express();
const mongoose = require('mongoose');
const app_server = require("./app.-routes");
const env = require("dotenv").config()
node_server.use(express.json());
const cors = require('cors');
const movie_router = require("./controller/Movie-controller");




node_server.use(bodyparser.json());
node_server.use(bodyparser.urlencoded({ extended:true }));


//Routes
node_server.use(cors());
node_server.use("/",app_server)
node_server.use('/',movie_router)


const port= process.env.PORT || 5000;
node_server.listen(port,() => { 
    console.log('server started', port);
})
mongoose.connect(process.env.Mongodb_url).then(()=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log
})
