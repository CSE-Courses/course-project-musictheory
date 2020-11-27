require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
//const connection = require("./model");
const mongoose =require('mongoose');
const port = process.env.PORT || 3000 ;
const app = express();


//define the modules we use
const bcrypt = require('bcryptjs')
const UserModel = require('./model/user')

//initialize some of the modules we use
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
var { response } = require('express');
const User = require('./model/user');
const { log } = require('console');

var SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');

//routes for our pages
const searchRoutes= require('./routes/searchRoutes');
const playlistRoutes  = require('./routes/playlistRoutes');
const failedSearchRoutes  = require('./routes/failedSearchRoutes');
const searchPageGenreRoutes  = require('./routes/searchPageGenreRoutes');
const signinRoutes  = require('./routes/signinRoutes');
const profileRoutes  = require('./routes/profileRoutes');
const playlistTemplateRoutes  = require('./routes/playlistTemplateRoutes');


app.set("views", path.join(__dirname,"/views/"));

app.use(express.static(path.join(__dirname, 'client')));
app.set('view engine', 'ejs');
app.set('view engine', 'hbs');

//binding our routes to our URLs
app.use('/search',searchRoutes);
app.use('/playlists',playlistRoutes);
app.use('/failedSearch',failedSearchRoutes);
app.use('/searchPageGenre',searchPageGenreRoutes);
app.use('/signin',signinRoutes);
app.use('/profile',profileRoutes);
app.use('/playlisttemplate',playlistTemplateRoutes);



app.use(express.static(__dirname + '/views'));

app.get('/',function(req,res){
    const a = "songs\\Behemoth\\Behemoth - I Loved You at Your Darkest (2018)\\Behemoth.jpg"; 
    const b = "Master of Puppets"
      res.render("index.ejs",{
          album1: a ,
          name : b
  
      });
  
  });


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
      console.log('The received data from the API: ', data.body.artists.items);
      const {items} = data.body.artists;
      console.log(items[0].images);
      res.render("artist-search-results.hbs", { artist: items })
      
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  });
  
  app.get("/Popular", (req,res) => {

    spotifyApi
    .getPlaylistTracks('37i9dQZF1DXcBWIGoYBM5M',{    
      offset: 1,
      limit: 20,
      fields: 'items'})
    .then(data => {
      //console.log('Some information about this playlist', data.body.tracks.items[0].track.name);
      //console.log('Some information about this playlist', data.body.tracks.items[0].track.artists);
      console.log('Some information about this playlist',data.body);
      const {items} = data.body;

  
      
    res.render("popular.hbs",{songs : items})

      
    })
    .catch(err => console.log('The error while searching playlist occurred: ', err));
    
  });
  
  app.get("/albums/:artistId", (req, res) => {
     const {artistId} = req.params
     console.log(req.params)
  
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

//---------------------------------Registration and Login Functionality---------------------------------------------------------------------

app.post('/createaccount', function(req, res){
  response = {
      usernameinfo : req.body.username,
      emailinfo : req.body.email,
      passwordinfo : req.body.password
      };


  console.log(response);  

  UserModel.findOne({ email: response['emailinfo']} , function(err, existingUser){
    if(existingUser == null){
      var passwordHash = response['passwordinfo']
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(passwordHash, salt, function(err, hash) {
          console.log(hash)
          const newUser = new UserModel({
            username : response['usernameinfo'], 
            password: hash,
            email: response['emailinfo'],
          });
        
          newUser.save();
          console.log('Registration successful');
          res.redirect('/');
        });
    });
    }
    else if(err){
      console.log(err);
    }
    else{
      console.log('user already exists');
    }
  })
});

app.post('/login', function(req, res){
  response = {
    email : req.body.loginemail,
    passwordinfo : req.body.loginpassword
  };

  console.log(response); 

  UserModel.findOne({email : response["email"]} , function(err, existingUser){
    if(existingUser == null){
      console.log("No user with that email") 
    }
    else{
      bcrypt.compare(response['passwordinfo'] , existingUser.password, function(err, result){
        if(result){
          console.log('youve been authenticated!')
          res.redirect('/')
        }
        else{
          console.log('bad login!')
          res.redirect('/signin')
        }
      }) 
     
    }
  })
})

app.listen(port);
