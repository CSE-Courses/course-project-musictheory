const express= require("express");
const router= express.Router();

router.get('/',function(req,res){
    var tempsession = req.session
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


router.get('/runningtomontana',function(req,res){
    res.render("./PlaylistTemplate.ejs")
});

module.exports= router;
