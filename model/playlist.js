const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    name: String,
    songs: Array,
    cover: String,
    title: String,
    status: String,
    owner: String,
    collaborators: Array

});

const playlists = mongoose.model("Playlist", PlaylistSchema);
module.exports = playlists;
