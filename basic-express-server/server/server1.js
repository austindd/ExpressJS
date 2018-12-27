const express = require('express');
const Path = require('path');
let app = express();

console.log('--- Running Server 1');


app.get('/', (req, res) => {
    console.log(`\r\n-- DATA REQUESTED --\r\n${req}`);
    res.sendFile(Path.join(__dirname, '../public/index.html'));
    console.log(`\r\n-- DATA SERVED --\r\n'../public/index.html'`);
})

app.get('/client/index.js', (req, res) => {
    console.log(`\r\n-- DATA REQUESTED --\r\n${req}`);
    res.sendFile(Path.join(__dirname, '../client/index.js'));
    console.log(`\r\n-- DATA SERVED --\r\n'/client/index.js'`);
})

app.use(express.static('../public'));

app.listen(3000);