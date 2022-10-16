require('dotenv').config();
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const request = require('request')
const fs = require("fs");
const path = require('path');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, autoIndex: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(express.json())

const directoryPath = path.join(__dirname, 'images')
app.use('/images', express.static(__dirname + '/images'));

const settingsRouter = require('./routes/testSettings')
app.use('/settings', settingsRouter)

const questionsRouter = require('./routes/testQuestions')
app.use('/questions', questionsRouter)

const domainsRouter = require('./routes/domains')
app.use('/domains', domainsRouter)

const apiRouter = require('./routes/api')
app.use('/api', apiRouter)
app.listen(3001, () => console.log('Server Started'))