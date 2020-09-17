const express = require('express');
const path = require('path');
const port = 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'client')));

app.get('/',function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});


app.listen(3000);