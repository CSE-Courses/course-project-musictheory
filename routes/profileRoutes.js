const express= require("express");
const router= express.Router();
const mongoose = require("mongoose");
const UserModel = require("../model/user");

router.get('/',function(req,res){
    var tempsession = req.session
    if(tempsession.sessionemail){
        UserModel.findOne({email : tempsession.sessionemail} , function(err, existingUser){
            if(existingUser == undefined){
                console.log("No profilepage/user with that email") 
              }
            else{
                res.render("profilepage.ejs" , {
                    username: existingUser.username,
                    email: existingUser.email,
                    pfp: existingUser.pfp,
                    number: existingUser.phonenumber
                });
            }
        })
    }
    else{
        res.redirect('/')
    }
});


module.exports= router;