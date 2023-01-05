const express = require('express')
const router = express.Router()
const Questions = require('../models/questions');
const Domain = require('../models/domains');
const Settings = require('../models/settings');
const Answer = require('../models/answers');
var psychotypes = require('../staticData/psychotypes.json')

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

// делать запрос сразу на сервер, потом проверять url-ref и key, потом возвращать get Запрос на клиент

router.get('/', async (req, res) => {
	let reqDomain = req.headers["request-url"];
	let findObj = {name:reqDomain};
	// console.log(findObj);
	let domain = await Domain.findOne(findObj).exec()
	if (domain){
		let settings = await Settings.findOne({_id: req.query.key}).exec();
		if (settings){
			let questions = await Questions.findOne({settingsId: settings._id, testTypeId: settings.testTypeId}).exec();
			if (questions){
				let resObj = {settings: settings, questions: questions}
				res.send(resObj);
			}
		} else {
			res.send({});
		}
	} else {
		res.send({});
	}
})

router.post('/', async (req, res) => {
	// console.log(req.body);

	let questionsId = req.body.questionsId;
	try {
		let questions = await Questions.findOne({_id: questionsId}).exec();

		if (questions){
			let requestData = req.body;
			if (questions.testTypeId == 1){
				let result = await resultOne(requestData, questions);
				res.send(result);
				return null;
			}
			if (questions.testTypeId == 2){
				let result = await resultTwo(requestData, questions);
				res.send(result);
				return null;
			}
		}

	} catch (err) {
		console.log(err);
	}

	let error = {error:"Ошибка"}
	res.send(error);
});

async function resultOne(requestData, questions) {
	let answers = requestData.selected;
	if (answers.length == 40 || answers.length == 80 || answers.length == 120 || answers.length == 160){
		let userData = requestData.userData;

		// calcData
		let sum = math(answers);
		let max = getLeads(sum);

		let psyhotypesChartText = questions.psyhotypesChartText.filter((item) => {
			return max.includes(item.id);
		});

		let leadPsychotypes = psyhotypesChartText.map(x=> x.title);

		let psyhotypesClientData = questions.psyhotypesClientData.filter((item) => {
			return max.includes(item.id);
		});

		let resultPsyhotypesClientData = [];

		psyhotypesClientData.forEach(element => {
			let dataLength = element.data.length;
			if (dataLength > 2){
				const rnd1 = generateRandomExcudeSome(dataLength);
				const rnd2 = generateRandomExcudeSome(dataLength, [rnd1]);
				const rnd3 = generateRandomExcudeSome(dataLength, [rnd1, rnd2]);

				const rnds = [rnd1, rnd2, rnd3];
				let rndData = [];

				rnds.forEach(index => {
					rndData.push(element.data[index]);
				})

				resultPsyhotypesClientData.push({
					id: element.id,
					data: rndData,
				})
			} else {
				resultPsyhotypesClientData.push(element);
			}
		});

		// console.log(resultPsyhotypesClientData);

		// console.log(leadPsychotypes);

		let result = {
			graphData: sum,
			max: max,
			psyhotypesChartText: psyhotypesChartText,
			psyhotypesClientData: resultPsyhotypesClientData,
		}

		let saveData = {
			questionsId: questions._id,
			userData: userData,
			answers: answers,
			sum: sum,
			max: max,
			leadPsychotypes: leadPsychotypes,
		}

		const answer = new Answer(saveData);
		// console.log(answer);
		try {
			const saveResult = await answer.save()
		} catch (err) {
			console.log(err);
		}

		return result;
	}
}

async function resultTwo(requestData, questions) {
	let answers = requestData.selected;
	let userData = requestData.userData;

	console.log(questions);

	let result = {
		simpleClientData: questions.simpleClientInfo
	}

	let saveData = {
		questionsId: questions._id,
		userData: userData,
		answers: answers,
	}

	const answer = new Answer(saveData);

	try {
		const saveResult = await answer.save()
	} catch (err) {
		console.log(err);
	}

	return result;
}

// router.put('/', async (req, res) => {
// 	res.send('Got a PUT request')
// })

// router.delete('/user', (req, res) => {
//   res.send('Got a DELETE request')
// })

function math(answers){

	const multiplicity = 40;
	const sumStep = 5;
	const resultCount = multiplicity / sumStep;

	let stageSum = [];
	for (let index = 0; index < answers.length; index += sumStep) {
		let stage = answers.slice(index, index + sumStep);
		let sum = stage.reduce((a, b) => a + b);
		stageSum.push(sum * 1.5);
	}

	return stageSum;
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

	let max = findMax(result, 3)
	return max;
}

function findMax(array, maxCount){
	let maxIndexes = [];
	let mMax = Math.max(...array);
	for (let i = 0; i < maxCount; i++) {
		let max = Math.max(...array);
		if (mMax / 3 * 2 < max){
			let maxIndex = array.indexOf(max);
			maxIndexes.push(maxIndex);
			array[maxIndex] = 0;
		}
	}

	return maxIndexes;
}

function generateRandomExcudeSome(length, exclude) {
	const rnd = Math.floor(Math.random() * length);

	if (exclude && exclude.includes(rnd)) {
		return generateRandomExcudeSome(length, exclude)
	}

	return rnd;
}

module.exports = router