const express= require("express");
const router= express.Router();
const TrackModel = require("../model/tracks");


router.get('/',function(req, res) {
    var tempsession = req.session
    let song_list = [{'_artist':'Earth Wind and Fire', '_album' : 'idk', '_song' : 'September'}, {'_artist':'Fear', '_album':'thisalbum', '_song':'escape'}]
 
  TrackModel.find({song: 'Wake Up with Jazz'}, (error,data) => {
    if(error){
      console.log(error)
    }else{
      console.log(data)
    }
  })

    if(tempsession.sessionusername){
        res.render("AllSongsPlaylist.ejs",{
          songs : 'song_list',
            signedin: 'Profile',
            signedinlink: '/profile',
            logout: "Logout"
          });
    }
    else{

      TrackModel.find({song: 'Wake Up with Jazz'}, (error,data) => {
        if(error){
          console.log(error)
        }else{
          console.log(data)
        }
      })

        res.render("AllSongsPlaylist.ejs",{
          'songs' : song_list,
          signedin: 'Sign In',
          signedinlink: '/signin',
          logout: ""
        });
      } 
});


module.exports= router;
