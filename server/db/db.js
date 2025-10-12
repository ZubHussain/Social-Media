const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
      });
      console.log("MongoDB Connected Successfully!");
    } catch (error) {
      console.error("MongoDB Connection Failed:", error);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;