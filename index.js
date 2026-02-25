const express = require("express"); 
const mongoose = require("mongoose"); 


const userRoutes = require('./routes/user'); // 
const workoutRoutes = require('./routes/workout'); // 

const app = express();

require('dotenv').config();

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));


app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes); 
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas."));


if(require.main === module){
    app.listen(process.env.PORT || 3000, () => 
        console.log(`Server running at port ${process.env.PORT || 3000}`)
    );
}

module.exports = {app, mongoose};