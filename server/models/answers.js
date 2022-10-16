const mongoose = require('mongoose')
const answersScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    fname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    sum: {
        type: Array,
        required: true,
    },
    max: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model('Answer', answersScheme)