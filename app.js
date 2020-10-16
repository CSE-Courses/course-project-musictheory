const express = require('express');
const path = require('path');
const { response } = require('express');
const port = 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static('static'))

//The routes for the different pages

app.get('/',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/index.html'));
});

app.get('/search',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/searchpage.html'));
});

app.get('/FailedSearch',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/FailedSearch.html'));
});

app.get('/profile',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/profilepage.html'));
});

app.get('/playlists',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/PlaylistPage.html'));
});

app.get('/playlists/runningtomontana',function(req, res) {
    res.sendFile(path.join(__dirname, '/static/html/PlaylistTemplate.html'));
});

app.listen(3000);