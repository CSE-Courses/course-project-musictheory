const express = require('express');
const path = require('path');
const { response } = require('express');
const PORT = process.env.PORT || '3000';

const app = express();
app.set("port", PORT);

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



var TrackSchema = new mongoose.Schema({
    artist: String,
    duration: Number,
    name : String,
    id : String,
    preview_url: String,
    fileName: String
    

});


var track = mongoose.model("tarck", TrackSchema);    // Adding to Database
// track.create({
//     artist : "Slipknot",
//     name: "funeral",
//     fileName : "aLiarsFuneral.mp3"
    

// }, function(error,data){
//     if(error){
//         console.log("An error while adding to Collection");
//         console.log(error);
//     }else{
//         console.log("Data added sucessfully");
//         console.log(data);
//     }
// });



var AlbumSchema = new mongoose.Schema({
    name: String,
    type : String,
    artist: String,
    id : String,
    images : String, 
    uri : String   

});

var album = mongoose.model("album", AlbumSchema);    // Adding to Database
// album.create({
//     name : "a",
//     artist: "Slipknot",
//     images : "https://upload.wikimedia.org/wikipedia/en/1/18/Slipknot_-_We_Are_Not_Your_Kind.png"
    

// }, function(error,data){
//     if(error){
//         console.log("An error while adding to Collection");
//         console.log(error);
//     }else{
//         console.log("Data added sucessfully");
//         console.log(data);
//     }
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


album.findOne({ name: "all"}, function(error,data){     //Retrieving data
    if(error){
        console.log("problem finding data");
    }else{
        console.log("Here is all the data");
        console.log(data);
        da=data;
    }
});


app.use(express.static(__dirname + '/views'));



app.get('/',function(req,res){
    album.findOne({ name: "We are not your kind"}, function(error,images){     //Retrieving data
        if(error){
            console.log("problem finding data");
        }else{
            

            res.render("index.ejs",{
                album1: images.images,
                alum1name: images.name
        
            });
        }
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
    res.render("PlaylistPage.ejs")
});
app.get('/playlists/runningtomontana',function(req,res){
    res.render("PlaylistTemplate.ejs")
});

app.get('/SearchPageGenre',function(req,res){
    res.render("SearchPageGenre.ejs")
});

app.get('/signin',function(req, res) {
    res.render("signin.ejs")
});


// app.get('/bday.mp3',function(req, res) {
//     res.sendFile(path.join(__dirname, 'bday.mp3'));
// });


app.get('/aLiarsFuneral.mp3',function(req, res) {
    res.sendFile(path.join(__dirname, 'aLiarsFuneral.mp3'));
});

app.listen(PORT);
