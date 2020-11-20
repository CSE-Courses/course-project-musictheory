const express= require("express");
const router= express.Router();
const session = require('express-session')

var sess;


router.get('/',function(req, res) {
    if(session.username){
        res.redirect('/')
    }
    res.render("./signin.ejs")
});


module.exports= router;