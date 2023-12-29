const mongoose = require('mongoose')
require('dotenv').config();
const uri = process.env.MONGO_URI;

const connectDB = async() => {
  
  try {
      await mongoose.connect(
      process.env.MONGO_URI)
      console.log(`Connected to MongoDb`)
  } catch(err) {
    // Ensures that the client will close when you finish/error
    console.log(`Error in application : ${err}`)
    // await client.close();
  }
}

module.exports = connectDB;