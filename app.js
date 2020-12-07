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
      username: tempsession.sessionusername,
      album1: a ,
      name : b
    });
  }
  else{
    res.render("index.ejs",{
      signedin: 'Sign In',
      signedinlink: '/signin',
      logout: "",
      username: "",
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
    var tempsession = req.session

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

  
      if(tempsession.sessionusername){
        res.render("popular.hbs",{songs : items,
        signedin: "Profile",
        signedinlink: '/profile',
        logout: "Logout"})
      }
      else{
        res.render("popular.hbs",{songs : items,
        signedin: "Sign In",
        signedinlink: '/signin',
        logout: ""})
      }

      
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
            uPlaylist: ['Liked Songs'],
            likedSongs: [] 
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
          sess.sessionemail = existingUser.email;
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

//---------------------Change user information fucntionality---------------------

app.post('/changeuserinfo' , function(req, res){
  response = {
    newusername : req.body.changeusername,
    newnumber : req.body.changephonenumber
  };
  sess = req.session
  UserModel.findOne({email : sess.sessionemail} , function(err, existingUser){
    if(existingUser == null){
      console.log("No user with the sessions email found in database")
      res.redirect('/')
    }
    else{
      existingUser.username = response['newusername']
      existingUser.phonenumber = response['newnumber']
      existingUser.save()
      req.session.sessionusername = response['newusername']
      res.redirect('/profile')
    }
  })
})

app.post('/changepassword' , function(req, res){
  var sess = req.session
  response = {
    oldpassword : req.body.oldpassword,
    newpassword : req.body.newpassword,
    newpassconfirm : req.body.newpasswordconfirm
  };
  UserModel.findOne({email: sess.sessionemail} , function(err, existingUser){
    if(existingUser == null){
      console.log("No user with the sessions email found in database")
      res.redirect('/')
    }
    else{
      bcrypt.compare(response['oldpassword'] , existingUser.password, function(err, result){
        if(result){
          if(response["newpassword"] == response['newpassconfirm']){
            bcrypt.genSalt(10, function(err, salt){
              bcrypt.hash(response['newpassword'] , salt, function(err, hash){
                existingUser.password = hash
                existingUser.save()
                console.log("password changed")
                res.redirect('/')
              })
            })
          }
          else{
            console.log("passwords do not match")
            res.redirect('/profile')
          }
        }
        else{
          console.log("old password is incorrect")
          res.redirect('/profile')
        }
      })
    }
  })
})

app.post("/changepfp" , function(req, res){
  var sess = req.session
  pfplink = req.body.pfplink
  UserModel.findOne({email: sess.sessionemail} , function(err, existingUser){
    if(existingUser == null){
      console.log("No user with the sessions email found in database")
      res.redirect('/')
    }
    else{
      existingUser.pfp = pfplink
      existingUser.save()
      console.log("pfp changed")
      res.redirect('/profile')
    }
  })

})

//-----------------------Logout and destroy user session----------------------
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

  PlaylistModel.find({}, function(err, playData){
    if(err){
      console.log(err)
    }
    else{
      console.log(playData)
    if(tempsession.sessionusername){
        res.render("PlaylistPage.ejs",{
            playData: playData,
            signedin: 'Profile',
            signedinlink: '/profile',
            logout: "Logout",
            username: tempsession.sessionusername
          });
    }
    else{
        res.render("PlaylistPage.ejs",{
          playData: playData,
          signedin: 'Sign In',
          signedinlink: '/signin',
          logout: ""
        });
      }
    }
  })   
});


app.post(/notif/, function(req, res) {
  console.log('==========PLAYLIST POST USERNAME==========')
  var username = req._parsedOriginalUrl._raw.substring(19);
  console.log(req._parsedOriginalUrl._raw.substring(19));
  console.log('==========PLAYLIST POST PLAYLIST NAME==========')
  var playlistName = req.body.name;
  console.log(playlistName);
  var ownership = username.concat("'s Playlist")
  console.log('==========OWNERSHIP============')
  console.log(ownership);

  console.log('==========Hashed Playlist Name==========')

  UserModel.findOne({username: username}, function(err, data){
    if(err){
      console.log(err)}
    else{
      all_lists = data.uPlaylist;
      console.log("========================Adding to User's current Playlists=======================")
      all_lists.push(playlistName);
      console.log(all_lists);
      data.save();
  } 
})

      var linkstr = playlistName.split(' ').join('+');

      console.log(linkstr)

      const newEntry = new PlaylistModel({
        name: linkstr,
        songs: [],
        cover: 'https://i.ibb.co/9Z3mQBJ/35-DEE189-7770-45-DD-BBCF-540499-B199-DD-png.jpg',
        title: playlistName,
        status: ownership,
        owner: username,
        collab: []
      });

      newEntry.save(function(err, doc) {
        if (err) return console.error(err);
        console.log("Document inserted succussfully!");
      });




  res.redirect('back');

});

//--------------------Functionality of Individual Playlist Pages-----------------------
app.post(/playlist/, function(req, res){
  let body = req.body.addSong;
  //console.log(body.toString())
  var bodyString = body.toString();
  var bodyArr = bodyString.split(',');
  var playList = bodyArr[0];
  var title = bodyArr[1];
  var artist = bodyArr[2];
  var album = bodyArr[3];
  var link = bodyArr[4];


  //Create song object with params from the song specified

  const newEntry = new TrackModel({
    album: album,
    artist : artist,
    link : link,
    song: title
  })

  console.log(newEntry);
  console.log(playList.toString());


  // Add to playlist with the name specified

  if(playList != "Liked Songs"){
  
  PlaylistModel.findOne({title: playList.toString()}, function(err, data){
    if(err){
      console.log(err)
    }
    else{
      let song_list = data.songs;
      song_list.push(newEntry);
      console.log(song_list);
      data.save();
    }
  })
  }

  //Adding to a specific user's liked songs by accessing their array

  else{

    var tempsession = req.session;
   // let userPlay = "";
    let song_list = "";
  
    UserModel.findOne({username: tempsession.sessionusername}, function(err, data){
      if(err){
        console.log(err)}
      else{
       // userPlay = data.uPlaylist;
        song_list = data.likedSongs;
       // console.log(userPlay); 
        console.log("======================== Liked Songs =======================")
        song_list.push(newEntry);
        console.log(song_list);
        data.save();
 
    } 
  })


  }

  //Redirecting

  res.redirect('back');


});

app.post(/playlists/, function(req, res){
    //Adding Profile Picture Psuedo 
    function readURL(input) {
      if (input.files && input.files[0]) {
    
        var reader = new FileReader();
    
        reader.onload = function(e) {
          $('.image-upload-wrap').hide();
    
          $('.file-upload-image').attr('src', e.target.result);
          $('.file-upload-content').show();
    
          $('.image-title').html(input.files[0].name);
        };
    
        reader.readAsDataURL(input.files[0]);
    
      } else {
        removeUpload();
      }
    }
    
    function removeUpload() {
      $('.file-upload-input').replaceWith($('.file-upload-input').clone());
      $('.file-upload-content').hide();
      $('.image-upload-wrap').show();
    }
    $('.image-upload-wrap').bind('dragover', function () {
        $('.image-upload-wrap').addClass('image-dropping');
      });
      $('.image-upload-wrap').bind('dragleave', function () {
        $('.image-upload-wrap').removeClass('image-dropping');
    });
  
    ///
})

app.get('/playlist/likedSongs', function(req, res){

  var tempsession = req.session;
  let userPlay = "";
  let song_list = "";

  UserModel.findOne({username: tempsession.sessionusername}, function(err, data){
    if(err){
      console.log(err)}
    else{
      userPlay = data.uPlaylist;
      song_list = data.likedSongs;
      console.log(userPlay); 
      console.log("======================== Liked Songs =======================")
      console.log(song_list); 
   

  res.render("LikedSongs.ejs",{
    uPlaylist : userPlay,
    'cover' : 'https://i.ibb.co/7RtWw8y/Screenshot-2020-12-04-205629.jpg',
    'title' : 'Liked Songs',
    'songs' : song_list,
    signedin: 'Profile',
    signedinlink: '/profile',
    logout: "Logout"
  });

} 
})

});

app.get(/playlist/ , function(req, res){
  var tempsession = req.session
  var playId = req._parsedOriginalUrl._raw.substring(10);


  console.log("=========PLAY ID=============")
  console.log(playId);
  console.log("=========PLAY ID END=============")

    console.log(tempsession.sessionusername);

    if(playId != "css/audioplayer.css" && playId != "js/audioplayer.js") {

    if(tempsession.sessionusername){

    var userPlay = "";

    UserModel.findOne({username: tempsession.sessionusername}, function(err, data){
    if(err){
        console.log(err)}
    else{
        userPlay = data.uPlaylist;
        console.log(userPlay); 

          PlaylistModel.findOne({name: playId}, function(err, data){
            if(err){
              console.log(err)
            }
            else{
              let song_list = data.songs;
              console.log(song_list)

              UserModel.find({}, function(err, allUsers){

            let userList = [];

            allUsers.forEach(function(user){
              userList.push(user.username)
            })

            console.log(userList);

              res.render("AllSongsPlaylist.ejs",{
                uPlaylist : userPlay,
                'owner' : data.owner,
                'currentUser': tempsession.sessionusername,
                'userList': userList,
                'cover' : data.cover,
                'title' : data.title,
                'songs' : song_list,
                signedin: 'Profile',
                signedinlink: '/profile',
                logout: "Logout"
              });

            });
            }
          })      

      } 
    })

  }



else{
    
  PlaylistModel.findOne({name: playId}, function(err, data){
    if(err){
      console.log(err)
    }
    else{
      let song_list = data.songs;
      console.log(song_list)
      // title is the name of the playlist displayed over EJS
      // name is whats used in the url to change the page
      res.render("AllSongsPlaylist.ejs",{
        uPlaylist : [],
        'cover' : data.cover,
        'title' : data.title,
        'songs' : song_list,
        signedin: 'Sign In',
        signedinlink: '/signin',
        logout: ""
      });
    }
  })
}

}



});



app.listen(port);
