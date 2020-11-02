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

const artist = mongoose.model("Artist", ArtistSchema);

module.exports = artist;