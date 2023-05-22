const app_server = require("express").Router();
const user_router = require("./controller/user-controller");
const admin_router = require("./controller/Admin-controller");
const movie_router = require("./controller/Movie-controller");
const booking_router = require("./controller/Booking-controller");




app_server.use("/user",user_router);
app_server.use("/admin",admin_router);
app_server.use("/movie",movie_router);
app_server.use("/booking",booking_router);



module.exports =app_server;