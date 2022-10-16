const express = require('express')
const router = express.Router()
const Domain = require('../models/domains');

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

router.get('/', (req, res) => {
    let findObj = req.body;
    Domain.find(findObj, (err, domains) => {
      if (err) {
        console.log(err);
      } else {
        if (domains) {
          res.send(domains);
        } else {
          res.send({});
        }
      }
    });
})

router.post('/', async (req, res) => {
    const domain = new Domain(req.body);
    console.log(domain);
    try {
		  const saveResult = await domain.save()
		  res.status(201).json(saveResult)
	  } catch (err) {
		  res.status(400).json({ error: err.message })
	  }
})

router.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

router.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})


module.exports = router