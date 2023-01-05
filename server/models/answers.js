const mongoose = require('mongoose')
const answersScheme = new mongoose.Schema({
    questionsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userData: {
        type: Object,
        required: true,
    },
    answers: {
        type: Array,
        required: true,
    },
    sum: {
        type: Array,
        // required: true,
    },
    max: {
        type: Array,
        // required: true,
    },
    leadPsychotypes:{
        type: Array,
        // required: true
    },
})

module.exports = mongoose.model('answers', answersScheme)