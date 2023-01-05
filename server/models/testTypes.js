// const mongoose = require('mongoose')
// const testTypesScheme = new mongoose.Schema({
//     id: {
//         type: Number,
//         unique: true,
//     },
//     name: {
//         type: String,
//     },
//     questionsCount: {
//         type: Number
//     }
// });

// const Type = mongoose.model('TestTypes', testTypesScheme);

// Type.findOne({id: 1}, (err, type) => {
//     if (err) {
//         console.log(err);
//         return null;
//     }

//     if (type) {
//         console.log(type);
//         return null;
//     }

//     const careerTest = new Type({id: 1, name: 'Карьера', questionsCount: 40});
//     Type.create(careerTest);
// });

// Type.findOne({id: 2}, (err, type) => {
//     if (err) {
//         console.log(err);
//         return null;
//     }

//     if (type) {
//         console.log(type);
//         return null;
//     }

//     const careerTest = new Type({id: 2, name: 'Карьера-2', questionsCount: 42});
//     Type.create(careerTest);
// });


// module.exports = mongoose.model('TestTypes', testTypesScheme);