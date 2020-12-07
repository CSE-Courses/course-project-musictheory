const express= require("express");
const router= express.Router();
const mongoose = require("mongoose");
const { model } = require("../model/album");



router.get('/',function(req,res){
    var tempsession = req.session
    if(tempsession.sessionusername){
        res.render("searchpage.ejs",{
            signedin: 'Profile',
            signedinlink: '/profile',
            logout: "Logout"
          });
    }
    else{
        res.render("searchpage.ejs",{
          signedin: 'Sign In',
          signedinlink: '/signin',
          logout: ""
        });
      }   
});



router.get('/bday.mp3',function(req, res) {
    res.sendFile(path.join(__dirname, 'bday.mp3'));
});


module.exports= router;