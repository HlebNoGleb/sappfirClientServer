const express = require('express')
const router = express.Router()
const Questions = require('../models/testQuestions');
const Domain = require('../models/domains');
const Settings = require('../models/testSettings');

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

router.get('/', async (req, res) => {
	let reqDomain = req.get('Referrer')
	let findObj = {name:reqDomain};
	let domain = await Domain.findOne(findObj).exec()
	if (domain){
		let questions = await Questions.findOne({testId: req.query.key}).exec();
		let settings = await Settings.findOne({domainId: domain._id}).exec();

		if (settings && questions){
			let resObj = {settings: settings, questions: questions}
			console.log(resObj)
			res.send(resObj);
		} else {
			res.send({});
		}
	} else {
		console.log(3333);
		res.send({});
	}
})

router.post('/', async (req, res) => {
	console.log(req.body);
	let answers = req.body.selected;
	let _stagesSum = [];
	// только 40 вопросов и ответов
	for (let index = 0; index < answers.length; index += 5) {
		let _stageSum = answers.slice(index, index + 5);
		let sum = _stageSum.reduce((a, b) => a + b);
		_stagesSum.push(sum);
	}

	console.log(_stagesSum);
})

router.put('/', async (req, res) => {

	res.send('Got a PUT request')
})

router.delete('/user', (req, res) => {
  res.send('Got a DELETE request')
})

module.exports = router