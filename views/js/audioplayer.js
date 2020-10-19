function playSong(songName){
    var player = document.getElementById("player");
    var songTitle = document.getElementById("song-title");
    var artistName = document.getElementById("artist-name");

    playerHTML = '<source src="/aLiarsFuneral.mp3" type="audio/mp3">';
    songTitleHTML = 'A liars Funeral';
    artistNameHTML = 'Slipknot';
    player.innerHTML = playerHTML;
    songTitle.innerHTML = songTitleHTML;
    artistName.innerHTML = artistNameHTML;

}