const mongoose = require("mongoose");

const connectDB = async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/social_media", {
      });
      console.log("MongoDB Connected Successfully!");
    } catch (error) {
      console.error("MongoDB Connection Failed:", error);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;