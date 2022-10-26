const express = require('express')
const router = express.Router()
const Questions = require('../models/testQuestions');
const Domain = require('../models/domains');
const Settings = require('../models/testSettings');
const Answer = require('../models/answers');
var psychotypes = require('../staticData/psychotypes.json')

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

	if (answers.length == 40 || answers.length == 80 || answers.length == 120 || answers.length == 160){
		let userData = req.body.data;
		let testId = req.body.testId;
		let sum = math(answers);
		let max = getLeads(sum);
		let psychotypesData = psychotypes.filter((item) => {
			return max.includes(item.id);
		});

		let leadPsychotypes = psychotypesData.map(x=> x.name);

		const id = {_id: testId};

		let settings = await Settings.findById(id).exec();

		let leadPsychotypesClientInfo = [];

		Object.keys(settings.resultClientData).forEach(element => {
			console.log(element);
			if (leadPsychotypes.includes(element)){
				// let obj = {};
				// obj[element] = settings.resultClientData[element];
				// leadPsychotypesClientInfo.push(obj);
				leadPsychotypesClientInfo.push(settings.resultClientData[element]);
			}
		});

		console.log(leadPsychotypesClientInfo);

		let result = {
			sum: sum,
			max: max,
			psychotypesData: psychotypesData,
			clientInfo: leadPsychotypesClientInfo,
		}

		let saveData = {
			userData: userData,
			answers: answers,
			sum: sum,
			max: max,
			leadPsychotypes: leadPsychotypes,
			testId: id,
		}

		const answer = new Answer(saveData);
		console.log(answer);
		try {
			const saveResult = await answer.save()
		} catch (err) {

		}

		res.send(result);
		return null;
	}

	let error = {error:"Ошибка"}
	res.send(error);
})

router.put('/', async (req, res) => {
	res.send('Got a PUT request')
})

router.delete('/user', (req, res) => {
  res.send('Got a DELETE request')
})

function math(answers){

	const multiplicity = 40;
	const sumStep = 5;
	const resultCount = multiplicity / sumStep;

	let stageSum = [];
	for (let index = 0; index < answers.length; index += sumStep) {
		let stage = answers.slice(index, index + sumStep);
		let sum = stage.reduce((a, b) => a + b);
		stageSum.push(sum);
	}

	console.log(stageSum);
	return stageSum;

	// 10,  35,  60,  85, 110, 135, 160, 185,
	// 210, 235, 260, 285, 310, 335, 360, 385,
	// 410, 435, 460, 485, 510, 535, 560, 585
}

function getLeads(sum){
	let result = [];
	for (let i = 0; i < sum.length; i++) {
		if (i + 1 < sum.length){
			result.push(sum[i] * sum[i+1]);
		} else {
			result.push(sum[i] * sum[0]);
		}
	}

	console.log(result);
	let max = findMax(result, 3)
	return max;
}

function findMax(array, maxCount){
	let maxIndexes = [];
	let mMax = Math.max(...array);
	for (let i = 0; i < maxCount; i++) {
		let max = Math.max(...array);
		if (mMax / 3 * 2 < max){
			console.log(max);
			let maxIndex = array.indexOf(max);
			maxIndexes.push(maxIndex);
			array[maxIndex] = 0;
		}
	}

	console.log(maxIndexes);
	return maxIndexes;
}

module.exports = router