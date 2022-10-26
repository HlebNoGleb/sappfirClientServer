const mongoose = require('mongoose')
const answersScheme = new mongoose.Schema({
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
        required: true,
    },
    max: {
        type: Array,
        required: true,
    },
    leadPsychotypes: {
        type: Array,
        required: true,
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
})

module.exports = mongoose.model('Answer', answersScheme)