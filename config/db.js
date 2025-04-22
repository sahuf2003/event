const mongoose = require("mongoose");
require('dotenv').config();

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODBURL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connection;
