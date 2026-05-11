const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            family: 4, // Force IPv4
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;