const express = require('express')
const router = express.Router()
const Questions = require('../models/questions');
const fileUpload = require('express-fileupload');

router.use(fileUpload());

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

router.get('/', (req, res) => {
	const findObj = req.query;
	Questions.find(findObj, (err, questions) => {
		if (err) {
			console.log(err);
		} else {
			if (questions) {
				res.send(questions);
			} else {
				res.send({});
			}
		}
	});
})

router.post('/', async (req, res) => {
	const questions = new Questions(req.body);
	console.log('POST' + questions);
 	try {
		const saveResult = await questions.save()
		res.status(201).json(saveResult)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

router.put('/', async (req, res) => {
	console.log(req.body);
	const filter = {settingsId: req.body.settingsId, testTypeId: req.body.testTypeId};
	const update = req.body;
	try {
		const saveResult = await Questions.findOneAndUpdate(filter, update);
		res.status(201).json(saveResult)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

router.put('/psyhotypesChartText', async (req, res) => {
	const filter = {_id: req.body.id};
	const update = {psyhotypesChartText: req.body.psyhotypesChartText}

	try {
		const saveResult = await Questions.findOneAndUpdate(filter, update);
		res.status(201).json(saveResult)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

router.put('/psyhotypesClientData', async (req, res) => {
	const filter = {_id: req.body.id};
	const update = {psyhotypesClientData: req.body.psyhotypesClientData}

	try {
		const saveResult = await Questions.findOneAndUpdate(filter, update);
		res.status(201).json(saveResult)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

router.put('/simpleClientInfo', async (req, res) => {
	const filter = {_id: req.body.id};
	const update = {simpleClientInfo: req.body.simpleClientInfo}

	try {
		const saveResult = await Questions.findOneAndUpdate(filter, update);
		res.status(201).json(saveResult)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

router.delete('/', async (req, res) => {
	console.log(req.query);
	const id = req.query.id;
	try {
		const deleteQuestions = await Questions.deleteOne({_id: id});
		if (deleteQuestions){
			let resObj = {
				questions: deleteQuestions
			}
			res.status(201).json(resObj);
		}
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

router.post("/upload", function(req, res)
{
    var file;

    if(!req.files)
    {
        res.send("File was not found");
        return;
    }

    file = req.files.sampleFile;  // here is the field name of the form
    console.log(file);
	console.log(req.body);
    res.send("File Uploaded");


});


module.exports = router