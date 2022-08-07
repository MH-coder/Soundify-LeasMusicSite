const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/soundify", {
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log('Database connected successfully!');
}).catch((e)=>{
    console.log('Database connection failed!');
})