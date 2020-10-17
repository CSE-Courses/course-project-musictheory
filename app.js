const express = require('express');
const path = require('path');
const { response } = require('express');
const port = 3000;
var fs = require('fs');
const app = express();
app.use(express.static(path.join(__dirname, 'client')));
app.set('view engine', 'ejs');



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



// var TrackSchema = new mongoose.Schema({
//     artist: String,
//     duration: Number,
//     name : String,
//     id : String,
//     preview_url: String,
//     fileName: String

// });

// var AlbumSchema = new mongoose.Schema({
//     name: String,
//     type : String,
//     artist: String,
//     id : String,
//     images : String, 
//     uri : String   

// });

// var ArtistSchema =  new mongoose.Schema({
//     id : String,
//     name: String,
//     type : String,
//     uri: String 
// });


 
// var artist = mongoose.model("Artist", ArtistSchema);    // Adding to Database
// artist.create({
//     id : "1",
//     name: "Slipkot",
//     type : "Artist",
//     uri: "" 

// }, function(error,data){
//     if(error){
//         console.log("An error while adding to Collection");
//         console.log(error);
//     }else{
//         console.log("Data added sucessfully");
//         console.log(data);
//     }
// });

// artist.find({}, function(error,data){     //Retrieving data
//     if(error){
//         console.log("problem finding data");
//     }else{
//         console.log("Here is all the data");
//         console.log(data);
//     }
// });

app.use(express.static(__dirname + '/views'));


app.get('/',function(req,res){
    const a = "https://i.redd.it/nymi0ev26kx41.jpg"; 
    res.render("index.ejs",{
        album1: a

    });
});
app.get('/search',function(req,res){
    res.render("searchpage.ejs")
});
app.get('/FailedSearch',function(req,res){
    res.render("FailedSearch.ejs")
});
app.get('/profile',function(req,res){
    res.render("profilepage.ejs")
});

app.get('/playlists',function(req,res){
    res.render("Playlistpage.ejs")
});
app.get('/playlists/runningtomontana',function(req,res){
    res.render("PlaylistTemplate.ejs")
});

app.get('/SearchPageGenre',function(req,res){
    res.render("SearchPageGenre.ejs")
});


//The routes for the different pages

// app.get('/',function(req, res) {
//     res.sendFile(path.join(__dirname, '/static/html/index.ejs'));
// });

// app.get('/search',function(req, res) {
//     res.sendFile(path.join(__dirname, '/static/html/searchpage.ejs'));
// });

// app.get('/FailedSearch',function(req, res) {
//     res.sendFile(path.join(__dirname, '/static/html/FailedSearch.ejs'));
// });

// app.get('/profile',function(req, res) {
//     res.sendFile(path.join(__dirname, '/static/html/profilepage.ejs'));
// });

// app.get('/playlists',function(req, res) {
//     res.sendFile(path.join(__dirname, '/static/html/PlaylistPage.ejs'));
// });

// app.get('/playlists/runningtomontana',function(req, res) {
//     res.sendFile(path.join(__dirname, '/static/html/PlaylistTemplate.ejs'));
// });


app.get('/bday.mp3',function(req, res) {
    res.sendFile(path.join(__dirname, 'bday.mp3'));
});

app.listen(3000);