const express = require('express')
const router = express.Router()
const Questions = require('../models/testQuestions');
const Domain = require('../models/domains');
const Settings = require('../models/testSettings');
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
		let sum = math(answers);
		let max = getMax(sum);
		let psychotypesData = psychotypes.filter((item) => {
			return max.includes(item.id);
		});

		let result = {
			sum: sum,
			max: max,
			psychotypesData: psychotypesData,
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

function sumEveryN(array, index = 0, n, ret){

	for (let i = index; i < n; i++) {
		ret.push(array[i]);
	}

	console.log(index);

	if (index < array.length){
		sumEveryN(array, index + n, n, ret);
	}

	return ret;
}

function getMax(sum){
	let data = [...sum];
	// console.log(data);

	let firstMax = checkMax(data);

	for (let i = 0; i < firstMax.length; i++) {
		data[firstMax[i]] = 0;
	}

	let secondMax = checkMax(data);
	let max = [...firstMax, secondMax[0]].sort();
	// console.log(max);

	return max;
}

function checkMax(sum){
	const max = Math.max(...sum);
	const maxIndexes = [];

	for (let i = 0; i < sum.length; i++) {
		if (sum[i] === max && maxIndexes.length < 2) {
			maxIndexes.push(i);
		}
	}

	return maxIndexes;
}

module.exports = router