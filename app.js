const express = require('express');
const path = require('path');
//const connection = require("./model");
const mongoose =require('mongoose');
const port = 3000;
const app = express();
const searchRoutes= require('./routes/searchRoutes');
const playlistRoutes  = require('./routes/playlistRoutes');
const failedSearchRoutes  = require('./routes/failedSearchRoutes');
const searchPageGenreRoutes  = require('./routes/searchPageGenreRoutes');
const signinRoutes  = require('./routes/signinRoutes');
const profileRoutes  = require('./routes/profileRoutes');


app.set("views", path.join(__dirname,"/views/"));

app.use(express.static(path.join(__dirname, 'client')));
//app.set('view engine', 'ejs');


app.use('/search',searchRoutes);
app.use('/playlists',playlistRoutes);
app.use('/failedSearch',failedSearchRoutes);
app.use('/searchPageGenre',searchPageGenreRoutes);
app.use('/signin',signinRoutes);
app.use('/profile',profileRoutes);

app.use(express.static(__dirname + '/views'));

app.get('/',function(req,res){
    const a = "songs\\Behemoth\\Behemoth - I Loved You at Your Darkest (2018)\\Behemoth.jpg"; 
    const b = "Master of Puppets"
      res.render("index.ejs",{
          album1: a ,
          name : b
  
      });
  
  });

const uri = "mongodb+srv://musicTheory:GY1HZHC60eb2MKo5@cluster0.eg8k3.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected…')
})
.catch(err => console.log(err))




app.listen(port);