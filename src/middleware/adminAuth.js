const jwt = require("jsonwebtoken");
const Admin = require("../models/adminRegisteration");

const auth = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyAdmin = jwt.verify(token, "soundifyisamusicplatformthatisusedtotellusersaboutmusicevents");
        const admin = await Admin.findOne({_id:verifyAdmin._id});

        req.admin=admin;
        // if(user){console.log(user);}
        next();
    } catch (error) {
        res.status(401).send("Admin Session has Expired!");
    }
}

module.exports = auth;