const express= require("express");
const router= express.Router();
const mongoose = require("mongoose");
const { model } = require("../model/album");



router.get('/',function(req,res){
    res.render("./searchpage.ejs")
});









router.get('/bday.mp3',function(req, res) {
    res.sendFile(path.join(__dirname, 'bday.mp3'));
});


module.exports= router;