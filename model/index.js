const mongoose = require("mongoose");
const { stringify } = require('querystring');


const uri = "mongodb+srv://musicTheory:GY1HZHC60eb2MKo5@cluster0.eg8k3.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected…')
})
.catch(err => console.log(err))


const db = require("./artist.js");
    // Adding to Database

// artist.create({
//     id : "1",
//     name: "Slipkot", 
//     type : "Artist",
//     uri: "" 

// }, function(error,data){
//     if(error){
//         console.log("An error while adding to Collection");
//         console.log(error);
//     }else{
//         console.log("Data added sucessfully");
//         console.log(data);
//     }
// });

// artist.find({}, function(error,data){     //Retrieving data
//     if(error){
//         console.log("problem finding data");
//     }else{
//         console.log("Here is all the data");
//         console.log(data);
//     }
// });