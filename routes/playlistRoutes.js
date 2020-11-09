const express= require("express");
const router= express.Router();

router.get('/',function(req,res){
    res.render("./Playlistpage.ejs")
});


router.get('/runningtomontana',function(req,res){
    res.render("./PlaylistTemplate.ejs")
});

module.exports= router;