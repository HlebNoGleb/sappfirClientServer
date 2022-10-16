const express = require('express')
const router = express.Router()
const Questions = require('../models/testQuestions');

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

router.get('/', (req, res) => {
	Questions.find({testId: req.query.test}, (err, questions) => {
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

	const filter = {testId: req.body.testId}
	const update = req.body;
	try {
		const saveResult = await Questions.findOneAndUpdate(filter, update);
		res.status(201).json(saveResult)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

router.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})


module.exports = router