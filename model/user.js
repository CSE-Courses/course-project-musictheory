const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var UserSchema =  new Schema({
    username : String,
    password: String,
    email : String,
    uPlaylist : Array,
    likedSongs: Array,
    pfp: String, 
    phonenumber: String,
    //albums: [album]
});

const User = mongoose.model("user", UserSchema);

module.exports = User;