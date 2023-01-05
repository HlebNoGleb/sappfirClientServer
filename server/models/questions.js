const mongoose = require('mongoose')
const questionsScheme = new mongoose.Schema({
    testTypeId: {
        type: Number,
        required: true,
    },
    settingsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    questions: {
        type: Array,
    },
    answers: {
        type: Array,
    },
    psyhotypesChartText:{
        type: Array,
    },
    psyhotypesClientData:{
        type: Array,
    },
    simpleClientInfo:{
        type: String,
    }
})

questionsScheme.index({ testTypeId: 1, settingsId: 1}, { unique: true });

module.exports = mongoose.model('Questions', questionsScheme)