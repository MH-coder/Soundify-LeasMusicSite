const jwt = require("jsonwebtoken");
const User = require("../models/userRegisteration");

const auth = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, "soundifyisamusicplatformthatisusedtotellusersaboutmusicevents");
        const user = await User.findOne({_id:verifyUser._id});

        req.user = user;
        // if(user){console.log(user);}
        next();
    } catch (error) {
        res.status(401).send("Your Session has Expired!");
    }
}

module.exports = auth;