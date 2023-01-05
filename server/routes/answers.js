const express = require('express')
const router = express.Router()
const Answer = require('../models/answers');

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

router.get('/', (req, res) => {
    Answer.find({questionsId: req.query.id}, (err, answers) => {
		if (err) {
			console.log(err);
		} else {
			// console.log(answers);
			if (answers) {
				res.send(answers);
			} else {
				res.send({});
			}
		}
	});
})

// router.post('/', (req, res) => {
//   	res.send('Got a POST request')
// })

// router.put('/user', (req, res) => {
//   res.send('Got a PUT request at /user')
// })

// router.delete('/user', (req, res) => {
//   res.send('Got a DELETE request at /user')
// })


module.exports = router