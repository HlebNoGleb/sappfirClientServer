const express = require('express')
const router = express.Router()
const Settings = require('../models/testSettings');
const Questions = require('../models/testQuestions');

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

router.get('/', (req, res) => {
	// get domain settings from database and return them as json object
	Settings.find({domainId: req.query.domain}, (err, settings) => {
		if (err) {
			console.log(err);
		} else {
			// console.log(settings);
			if (settings) {
				res.send(settings);
			} else {
				res.send({});
			}

		}
	});
})

router.post('/', async (req, res) => {
	const settings = new Settings(req.body);
	console.log('POST' + settings);
 	try {
		const saveResult = await settings.save()
		res.status(201).json(saveResult)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

router.put('/', async (req, res) => {
	const filter = {_id: req.body._id}
	const update = req.body;
	console.log(filter);
	try {
		const saveResult = await Settings.findOneAndUpdate(filter, update);
		res.status(201).json(saveResult)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

router.delete('/', async (req, res) => {
	console.log(req.query);
	const id = req.query.id;
	try {
		const deleteSettings = await Settings.deleteOne({_id: id});
		const deleteQuestions = await Questions.deleteOne({testId: id});
		if (deleteSettings && deleteQuestions){
			let resObj = {
				settings: deleteSettings,
				questions: deleteQuestions
			}
			res.status(201).json(resObj);
		}
	} catch (error) {
		res.status(400).json({ error: err.message })
	}
})


module.exports = router