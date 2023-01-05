const mongoose = require('mongoose')
const clientDataScheme = new mongoose.Schema({
    questionsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    data: {
        type: Object,
    },
})

module.exports = mongoose.model('ClientData-new', clientDataScheme)