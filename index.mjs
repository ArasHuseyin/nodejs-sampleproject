/*
import express from 'express';
import path from 'path';
import https from 'http2';
//import router from './routingTest';

//const express = require('express');
const PORT = 8080;
const app = express()


const __dirname = path.resolve();
const viewsPath = path.join(__dirname, "./views");
console.log('------------------------------------')

app.set("views", viewsPath);
app.set('view engine', 'html');
console.log(path.join(__dirname, './public/css'))
app.use(express.static(path.join(__dirname, './public/css')));

app.get('/saas', function (req, res) {
    res.send('hello world!');
    res.redirect('/dataset');
});
app.get('/sadassa',(req,res) => {
    res.render('index')
})


//app.use(express.static(path.join(__dirname, 'views')));

//app.use('/dataset',router);

app.get('/',(req,res) => {
    res.sendFile(path.join(viewsPath + '/sample.html'))
})

console.log(path.join(viewsPath + './index.html'));
app.get('/loc', (req,res) => {
    res.sendFile(path.join(viewsPath + '/index.html'));
});

app.listen(PORT, () => console.log(`app is listening at ${PORT}`));
*/
console.log('index datei');