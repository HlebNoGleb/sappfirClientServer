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
const fileUpload = require('express-fileupload');

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

process.on('uncaughtException', (err, origin) => {
    //code to log the errors
    console.log(
       `Caught exception: ${err}\n` +
       `Exception origin: ${origin}`,
     );
});

app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));

const settingsRouter = require('./routes/testSettings')
app.use('/settings', settingsRouter)

const questionsRouter = require('./routes/questions')
app.use('/questions', questionsRouter)

const defaultRouter = require('./routes/default')
app.use('/default', defaultRouter)

const domainsRouter = require('./routes/domains')
app.use('/domains', domainsRouter)

const answersRouter = require('./routes/answers')
app.use('/answers', answersRouter)

const apiRouter = require('./routes/api')
app.use('/api', apiRouter)

app.post("/upload", function(req, res){
    if(!req.files)
    {
        res.send("File was not found");
        return;
    }

    const files = req.files.sampleFile;
    const path = req.body.path;
    const directory = 'uploads/' + path;
    let result = {
        errors: [],
        data: []
    };

    console.log(files.length);

    if (files.length > 1) {
        files.forEach(file => {
            let ret = saveFiles(directory, file);
            console.log(ret);

            if(ret.error){
                result.errors.push(ret.error);
            }

            result.data.push(ret.data);
        });

        res.send(result);
        return;
    }

    let ret = saveFiles(directory, files);
    if(ret.error){
        result.errors.push(ret.error);
    }
    result.data.push(ret.data);

    res.send(result);
});

function saveFiles(directory, file){
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(`${directory}/${file.name}/`, file.data, function (error) {
        if (error) {
            console.log(error);
        }
    });

     const retObj = {
        data: `Файл ${file.name} сохранен`
     }

    return retObj;
}


app.get("/getFiles", function(req, res){
    const path = req.query.path;
    const directory = 'uploads/' + path;
    console.log("dir---" + directory)
    if (fs.existsSync(directory)){
        console.log(1);
        let images = fs.readdirSync(directory, (err, files) => {
            const fileNames = [];
            files.forEach(file => {
                fileNames.push(file);
            });

            return fileNames;
        });
        const result = {
            path: directory,
            images: images
        };

        console.log(result);
        res.send(result);
        return;
    }

    res.send({error: "no data"});
});



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