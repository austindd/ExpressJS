const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
let app = express();
console.log(`--- Running server1 ---`);

app.use((req, res, next) => {
    fs.appendFileSync(path.join(__dirname, '../serverlogs/requestlog.txt'), `${req.url}\r\n`);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/formsubmissions', (req, res, next) => {
    console.log(req.body.name);
    console.log(req.body.email);
    res.send(`Your Name: ${req.body.name}\r\nYour Email: ${req.body.email}`);
    let contacts = {name: req.body.name, email: req.body.email};
    console.log(contacts);
    fs.writeFileSync(path.join(__dirname, '../serverdata/contacts.json'), JSON.stringify(contacts));
    next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000);

// app.get('/', (req, res) => {
//     res.send('Hello World');
// })


// app.get('/order/:name/:email', (req, res) => {
//     let name = req.params.name;
//     let email = req.params.email;
//     res.send(`Your name is ${name} and your email is ${email}`);
// });

