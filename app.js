require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
//const connection = require("./model");
const mongoose =require('mongoose');
const port = process.env.PORT || 3000 ;
const app = express();
const session = require('express-session')


//define the modules we use
const bcrypt = require('bcryptjs')
const UserModel = require('./model/user')
const TrackModel = require("./model/tracks")
const PlaylistModel = require('./model/playlist')


//initialize some of the modules we use
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(
  session({
  secret: "secretzz",
  saveUninitialized: false,
  resave: false
  })
  );
var { response } = require('express');
const User = require('./model/user');
const { log } = require('console');

var SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');

//routes for our pages
const searchRoutes= require('./routes/searchRoutes');
//Adding Playlists into app, removing router
//const playlistRoutes  = require('./routes/playlistRoutes');
//const allSongsRoutes  = require('./routes/AllSongsRoutes');
const failedSearchRoutes  = require('./routes/failedSearchRoutes');
const searchPageGenreRoutes  = require('./routes/searchPageGenreRoutes');
const signinRoutes  = require('./routes/signinRoutes');
const profileRoutes  = require('./routes/profileRoutes');
const playlistTemplateRoutes  = require('./routes/playlistTemplateRoutes');

//global variable for sessions, not recommended for production
var sess;


app.set("views", path.join(__dirname,"/views/"));

app.use(express.static(path.join(__dirname, 'client')));
app.set('view engine', 'ejs');
app.set('view engine', 'hbs');

//binding our routes to our URLs
app.use('/search',searchRoutes);
//app.use('/playlists',playlistRoutes);
app.use('/failedSearch',failedSearchRoutes);
app.use('/searchPageGenre',searchPageGenreRoutes);
app.use('/signin',signinRoutes);
app.use('/profile',profileRoutes);
app.use('/playlisttemplate',playlistTemplateRoutes);
//app.use('/allSongs', allSongsRoutes);



app.use(express.static(__dirname + '/views'));

app.get('/',function(req,res){
  var tempsession = req.session
  const a = "songs\\Behemoth\\Behemoth - I Loved You at Your Darkest (2018)\\Behemoth.jpg"; 
  const b = "Master of Puppets"
  if(tempsession.sessionusername){
    res.render("index.ejs",{
      signedin: 'Profile',
      signedinlink: '/profile',
      logout: "Logout",
      album1: a ,
      name : b
    });
  }
  else{
    res.render("index.ejs",{
      signedin: 'Sign In',
      signedinlink: '/signin',
      logout: "",
      album1: a ,
      name : b
    });
  }
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
    var tempsession = req.session;
    const { artistName } = req.query;
    if(tempsession.sessionusername){
    spotifyApi
    .searchArtists(artistName)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      const {items} = data.body.artists;
      console.log(items[0].images);
      res.render("artist-search-results.hbs", { 
        artist: items,
        signedin: 'Profile',
        signedinlink: '/profile',
        logout: "Logout"
       })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
    }
    else{
      spotifyApi
      .searchArtists(artistName)
      .then(data => {
        console.log('The received data from the API: ', data.body.artists.items);
        const {items} = data.body.artists;
        console.log(items[0].images);
        res.render("artist-search-results.hbs", { 
          artist: items,
          signedin: 'Sign In',
          signedinlink: '/signin',
          logout: ""
         })
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
    }
    
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

  app.get("/SearchPageGenre/:id", (req,res) => {
    const {id} = req.params

    spotifyApi
    .getPlaylistTracks(id,{    
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
    var tempsession = req.session
     const {artistId} = req.params
     console.log(req.params)
    
     if(tempsession.sessionusername){
      spotifyApi
      .getArtistAlbums(artistId)
      .then((data) => {
        //const {album} = data.body;
        const {items} = data.body
        res.render("albums", {
          albums : items,
          signedin: 'Profile',
          signedinlink: '/profile',
          logout: "Logout"
        });
          })
    
      .catch((err => console.log('The error while searching albums occurred: ', err))); 
     }
     else{
      spotifyApi
      .getArtistAlbums(artistId)
      .then((data) => {
        //const {album} = data.body;
        const {items} = data.body
        res.render("albums", {
          albums : items,
          signedin: 'Sign In',
          signedinlink: '/signin',
          logout: ""
        });
          })
    
      .catch((err => console.log('The error while searching albums occurred: ', err))); 
     }
  
  }); 
  
  app.get("/tracks/:albumId", (req,res) =>{
    var tempsesson = req.session
    const {albumId} = req.params;
    if(tempsesson.sessionusername){
      spotifyApi
    .getAlbumTracks(albumId)
      .then((data) => {
      const {items} = data.body;
      res.render("tracks", { 
        tracks : items,
        signedin: 'Profile',
        signedinlink: '/profile',
        logout: "Logout"})
      })
      .catch((err => console.log('The error while searching tracks occurred: ', err))); 
    }
    else{
      spotifyApi
    .getAlbumTracks(albumId)
      .then((data) => {
      const {items} = data.body;
      res.render("tracks", { 
        tracks : items,
        signedin: 'Sign In',
        signedinlink: '/signin',
        logout: ""})
      })
      .catch((err => console.log('The error while searching tracks occurred: ', err))); 
    }
    
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


  //console.log(response);  

  UserModel.findOne({ email: response['emailinfo']} , function(err, existingUser){
    if(existingUser == null){
      var passwordHash = response['passwordinfo']
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(passwordHash, salt, function(err, hash) {
          //console.log(hash)
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
          sess = req.session;
          sess.sessionusername = existingUser.username;
          //console.log('session username:')
          //console.log(sess.sessionusername)
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

app.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      sess = req.session
      res.redirect('/');
  });

});

//-------------------playlist routing--------------------
app.get('/playlists',function(req,res){
  var tempsession = req.session


  const newPlaylist = new PlaylistModel({
    name: "allSongs",
    cover: "",
    songs: [
     {
        "song":"Crush The Industry",
        "album":"Dethalbum III",
        "artist":"Metalocalypse:Dethklok",
        "link":"https://p.scdn.co/mp3-preview/ecf3dda38271454c6c23b9112b657e13a87b35af?cid=9343127d9efd4b1a92df981900ff6e5f" 
      },
    {
      "song":"Wake Up with Jazz",
      "artist":"Jazz Morning Playlist",
      "album":"None",
      "link":"https://p.scdn.co/mp3-preview/e832d9cdd9946254b5da9782bac0dd7f45204683?cid=9343127d9efd4b1a92df981900ff6e5f"
    }

    ]
  })

  newPlaylist.save()

  PlaylistModel.findOne({name: "allSongs"}, function(err, data){
    if(err){
      console.log(err)
    }
    else{
      console.log(data.songs)
    }
  })




  if(tempsession.sessionusername){
      res.render("playlistPage.ejs",{
          signedin: 'Profile',
          signedinlink: '/profile',
          logout: "Logout"
        });
  }
  else{
      res.render("playlistPage.ejs",{
        signedin: 'Sign In',
        signedinlink: '/signin',
        logout: ""
      });
    }   
});
//--------------------allSongsTest-----------------------
app.get(/playlist/ , function(req, res){
  var tempsession = req.session
  console.log(req._parsedOriginalUrl._raw.substring(10));

   let song_list = [{'_artist':'Earth Wind and Fire', '_album' : 'idk', '_song' : 'September'}, {'_artist':'Fear', '_album':'thisalbum', '_song':'escape'}]

  if(tempsession.sessionusername){
    
      
    TrackModel.find({}, function(err, song_list){
      if(err){
        console.log(err)
      }
      else{
        res.render("AllSongsPlaylist.ejs",{
            'songs' : song_list,
            signedin: 'Profile',
            signedinlink: '/profile',
            logout: "Logout"
          });
      }
    })


}

else{

    TrackModel.find({}, function(err, song_list){
      if(err){
        console.log(err)
      }
      else{

        res.render("AllSongsPlaylist.ejs",{
          'songs' : song_list,
          signedin: 'Sign In',
          signedinlink: '/signin',
          logout: ""
        });
      }
    })
    
  // TrackModel.find({})(function(err, songs_list){
  //   if(err){
  //     console.log(err)
  //   }
  //   else{
  //     console.log(songs_list)
  //   }
  // })

}

})



app.listen(port);
