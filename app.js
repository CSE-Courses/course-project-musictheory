const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
//const connection = require("./model");
const mongoose =require('mongoose');
const port = 3000;
const app = express();

//define the modules we use
const bcrypt = require('bcrypt')
const UserModel = require('./model/user')

//initialize some of the modules we use
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//routes for our pages
const searchRoutes= require('./routes/searchRoutes');
const playlistRoutes  = require('./routes/playlistRoutes');
const failedSearchRoutes  = require('./routes/failedSearchRoutes');
const searchPageGenreRoutes  = require('./routes/searchPageGenreRoutes');
const signinRoutes  = require('./routes/signinRoutes');
const profileRoutes  = require('./routes/profileRoutes');
var { response } = require('express');
const User = require('./model/user');
const { log } = require('console');


app.set("views", path.join(__dirname,"/views/"));

app.use(express.static(path.join(__dirname, 'client')));
//app.set('view engine', 'ejs');

//binding our routes to our URLs
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

app.post('/createaccount', function(req, res){
  response = {
      usernameinfo : req.body.username,
      emailinfo : req.body.email,
      passwordinfo : req.body.password
      };

  console.log(response);  

  UserModel.findOne({ email: response['emailinfo']} , function(err, existingUser){
    if(existingUser == null){
      var passwordHash = response['passwordinfo']
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(passwordHash, salt, function(err, hash) {
          console.log(hash)
          const newUser = new UserModel({
            username : response['usernameinfo'], 
            password: hash,
            email: response['emailinfo'],
          });
        
          newUser.save();
          console.log('Registration successful');
          res.redirect('/');
        });
    });
    }
    else if(err){
      console.log(err);
    }
    else{
      console.log('user already exists');
    }
  })
});

app.post('/login', function(req, res){
  response = {
    email : req.body.loginemail,
    passwordinfo : req.body.loginpassword
  };

  console.log(response); 

  UserModel.findOne({email : response["email"]} , function(err, existingUser){
    if(existingUser == null){
      console.log("No user with that email") 
    }
    else{
      bcrypt.compare(response['passwordinfo'] , existingUser.password, function(err, result){
        if(result){
          console.log('youve been authenticated!')
          res.redirect('/')
        }
        else{
          console.log('bad login!')
          res.redirect('/signin')
        }
      }) 
     
    }
  })
})

app.listen(port);