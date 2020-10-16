const express = require('express');
const path = require('path');
const { response } = require('express');
const port = 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static('static'))



const mongoose = require("mongoose");
const { stringify } = require('querystring');


const uri = "mongodb+srv://musicTheory:GY1HZHC60eb2MKo5@cluster0.eg8k3.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected…')
})
.catch(err => console.log(err))


var ArtistSchema =  new mongoose.Schema({
    id : String,
    name: String,
    type : String,
    uri: String 
});
var AlbumSchema = new mongoose.Schema({
    name: String,
    type : String,
    artist: String,
    id : String,
    images : String, 
    uri : String   

});
var TrackSchema = new mongoose.Schema({
    artist: String,
    duration: Number,
    name : String,
    id : String,
    preview_url: String,
    uri : String

})
 
var artist = mongoose.model("Artist", ArtistSchema);    // Adding to Database
artist.create({
    id : "1",
    name: "Slipkot",
    type : "Artist",
    uri: "" 

}, function(error,data){
    if(error){
        console.log("An error while adding to Collection");
        console.log(error);
    }else{
        console.log("Data added sucessfully");
        console.log(data);
    }
});

artist.find({}, function(error,data){     //Retrieving data
    if(error){
        console.log("problem finding data");
    }else{
        console.log("Here is all the data");
        console.log(data);
    }
});





//The routes for the different pages

app.get('/',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/index.html'));
});

app.get('/search',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/searchpage.html'));
});

app.get('/FailedSearch',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/FailedSearch.html'));
});

app.get('/profile',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/profilepage.html'));
});

app.get('/playlists',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/PlaylistPage.html'));
});

app.get('/playlists/runningtomontana',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/PlaylistTemplate.html'));
});


app.get('/bday.mp3',function(req, res) {
    res.sendFile(path.join(__dirname, 'bday.mp3'));
});

app.listen(3000);