const mongoose =require('mongoose');
const Schema = mongoose.Schema;


var AlbumSchema = new Schema({
    name: String,
    artist: String,
    id : String,
    image : String, 
    //tracks : [track]

});

var album = mongoose.model("Album", AlbumSchema);

module.exports = album;