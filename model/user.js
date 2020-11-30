const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var UserSchema =  new Schema({
    username : String,
    password: String,
    email : String,
    pfp: String, 
    phonenumber: String,
    //albums: [album]
});

const User = mongoose.model("user", UserSchema);

module.exports = User;