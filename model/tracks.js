const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const TrackSchema = new Schema({
    album: String,
    artist : String,
    link : String,
    song: String

});

const track = mongoose.model("Track", TrackSchema);
module.exports = track;

// var track1=new track({

//     artist: "Slipknot",
//     duration: '5',
//     name : "A Liar's Funeral",
//     id : "07",
//     fileName: "songs\Slipknot\We Are Not Your Kind\07. A Liar's Funeral.mp3"

// });

// }, function(error,data){
//     if(error){
//         console.log("An error while adding to Collection");
//         console.log(error);
//     }else{
//         console.log("Data added sucessfully");
//         console.log(data);
//     }