const express= require("express");
const router= express.Router();


router.get('/',function(req, res) {
    var tempsession = req.session
    if(tempsession.sessionusername){
        res.render("AllSongsPlaylist.ejs",{
            signedin: 'Profile',
            signedinlink: '/profile',
            logout: "Logout"
          });
    }
    else{
        res.render("AllSongsPlaylist.ejs",{
          signedin: 'Sign In',
          signedinlink: '/signin',
          logout: ""
        });
      } 
});


module.exports= router;
