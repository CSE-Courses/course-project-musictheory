const express= require("express");
const router= express.Router();
const session = require('express-session')

router.get('/',function(req, res) {
    var tempsession = req.session
    //console.log('session username:')
    //console.log(tempsession.sessionusername)
    if(tempsession.sessionusername){
        res.redirect('/')
    }
    res.render("./signin.ejs")
});


module.exports= router;