const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const userRegSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:[true, "Email already registered!"]
    },
    pass:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    registeredEvents:[{
        registeredEvent:{
            type:String
        }
    }]
})

userRegSchema.methods.generateUserAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, "soundifyisamusicplatformthatisusedtotellusersaboutmusicevents");
        this.tokens = this.tokens.concat({token:token});
        // console.log(token);
        await this.save();
        return token;
    } catch (error) {
        res.send(`Error: ${error}`);
        console.log(`Error: ${error}`);
    }
}

// Creating a new Collection/Table
const User = new mongoose.model("User", userRegSchema);
module.exports = User;