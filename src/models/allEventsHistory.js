const mongoose = require('mongoose');
const eventsHistory = new mongoose.Schema({
    eventName:{
        type:String,
        required:true
    },
    eventDesc:{
        type:String,
        required:true,
    },
    artist:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    eventStatus:{
        type:String,
        required:true
    }
})

// Creating a new Collection/Table
const History = new mongoose.model("History", eventsHistory);
module.exports = History;