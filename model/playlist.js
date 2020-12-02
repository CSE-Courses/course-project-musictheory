const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    name: String,
    songs: Array,
    cover: String

});

const playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = playlist;
