require('dotenv').config();
const express = require('express');
const path = require('path');
//const connection = require("./model");
const mongoose =require('mongoose');
const port = 3000;
const app = express();
const searchRoutes= require('./routes/searchRoutes');
const playlistRoutes  = require('./routes/playlistRoutes');
const failedSearchRoutes  = require('./routes/failedSearchRoutes');
const searchPageGenreRoutes  = require('./routes/searchPageGenreRoutes');
const signinRoutes  = require('./routes/signinRoutes');
const profileRoutes  = require('./routes/profileRoutes');
var SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');

app.set("views", path.join(__dirname,"/views/"));

app.use(express.static(path.join(__dirname, 'client')));
//app.set('view engine', 'ejs');


app.use('/search',searchRoutes);
app.use('/playlists',playlistRoutes);
app.use('/failedSearch',failedSearchRoutes);
app.use('/searchPageGenre',searchPageGenreRoutes);
app.use('/signin',signinRoutes);
app.use('/profile',profileRoutes);

// -----------------SpotifyAPI --------------------------------------------------------------------

//scopes = ['user-read-private', 'user-read-email','playlist-modify-public','playlist-modify-private']

var spotifyApi = new SpotifyWebApi({
  clientId: '9343127d9efd4b1a92df981900ff6e5f',
  clientSecret: '0e7a79851c7344a4b69dc0846d771063',
  redirectUri: 'http://localhost:3000/'
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


  app.get("/artist-search", (req, res) => {
    const { artistName } = req.query;
    spotifyApi
    .searchArtists(artistName)
    .then(data => {
      //console.log('The received data from the API: ', data.body.artists.items);
      const {items} = data.body.artists;
      //console.log(items[0].images);
      res.render("artist-search-results", { artist: items })
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  });
  
  
  app.get("/albums/:artistId", (req, res) => {
     const {artistId} = req.params;
  
     spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      //const {album} = data.body;
      const {items} = data.body
      res.render("albums", {albums : items});
        })
  
    .catch((err => console.log('The error while searching albums occurred: ', err))); 
  
  }); 
  
  app.get("/tracks/:albumId", (req,res) =>{
  const {albumId} = req.params;
  spotifyApi
  .getAlbumTracks(albumId)
    .then((data) => {
    const {items} = data.body;
    res.render("tracks", { tracks : items})
    })
    .catch((err => console.log('The error while searching tracks occurred: ', err))); 
  })




// ----------------------------Dynamic Control------------------------------------------------------------------------


app.use(express.static(__dirname + '/views'));

app.get('/',function(req,res){
    const a = "songs\\Behemoth\\Behemoth - I Loved You at Your Darkest (2018)\\Behemoth.jpg"; 
    const b = "Master of Puppets"
      res.render("index.ejs",{
          album1: a ,
          name : b
  
      });
  
  });


//-------------------------------------Database-------------------------------------------------------
const uri = "mongodb+srv://musicTheory:GY1HZHC60eb2MKo5@cluster0.eg8k3.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected…')
})
.catch(err => console.log(err))

//------------------------------------------------------------------------------------------------------



app.listen(port);