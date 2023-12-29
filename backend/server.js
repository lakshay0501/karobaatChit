const express = require("express");
const chats = require('./data/data');
const dotenv = require('dotenv');
const cors = require("cors");
const connectDB = require("./config/db");
const colors = require('colors');
const userRoutes = require('./routes/userRoutes') 
const chatRoutes = require('./routes/chatRoutes')
const mongoose = require('mongoose')
const{notfound,errorHandler} = require('./middleware/errorMiddleware')
dotenv.config();
// connectDB();

mongoose.connect(
process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch(()=>{
    console.log("Couldn't connect to MongoDB");
})

const app = express();
app.use(cors());
app.use(express.json()); // to accept json data

// app.get('/',(req,res)=>{
//     res.send('APP IS RUNNING')
// })

// app.get('/api/chat',(req,res)=>{
//    res.send(chats)
// })



app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)

app.use(notfound)

app.use(errorHandler)

const port = process.env.PORT || 3600

app.listen(port,console.log(`Server listening to port ${port}`.cyan.bold));