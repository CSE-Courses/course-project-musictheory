const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var ArtistSchema =  new Schema({
    id : String,
    name: String,
    type : String,
    uri: String, 
    //albums: [album]
});

const artist = mongoose.model("Artist", ArtistSchema);

module.exports = artist;