'use strict'

const express = require('express'); 
const routerMessages = require('./routes/message');
const passport = require('passport');
const app = express();
// indico donde estan los archivos estaticos
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//initialize passport
app.use(passport.initialize());
//app.use(passport.session());
app.use('/api/messages',routerMessages);

module.exports = app;