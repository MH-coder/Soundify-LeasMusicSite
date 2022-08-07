const mongoose = require('mongoose');
const eventPostSchema = new mongoose.Schema({
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
const Post = new mongoose.model("Post", eventPostSchema);
module.exports = Post;