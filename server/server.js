require('dotenv').config();
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const request = require('request')
const fs = require("fs");
const path = require('path');
const serveIndex = require('serve-index');
const cors = require('cors');
const https = require('https');
const http = require('http');

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

app.use(cors());

const directoryPath = path.join(__dirname, 'images')
app.use('/images', express.static(__dirname + '/images'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));

const settingsRouter = require('./routes/testSettings')
app.use('/settings', settingsRouter)

const questionsRouter = require('./routes/testQuestions')
app.use('/questions', questionsRouter)

const defaultRouter = require('./routes/default')
app.use('/default', defaultRouter)

const domainsRouter = require('./routes/domains')
app.use('/domains', domainsRouter)

const answersRouter = require('./routes/answers')
app.use('/answers', answersRouter)

const apiRouter = require('./routes/api')
app.use('/api', apiRouter)


// app.listen(81, () => console.log('Server Started'))



const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/server.sappfir.online/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/server.sappfir.online/fullchain.pem'),
}, app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});