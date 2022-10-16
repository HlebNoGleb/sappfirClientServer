const mongoose = require('mongoose')
const testSettingsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    domainId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    description: {
        type: String,
    },
    help: {
        type: String,
    },
    image: {
        type: String,
    },
    color: {
        type: Object,
        default: {
            mainColor: '#000',
            secondaryColor: '#fff',
            tertiaryColor: '#124354'
        }
    },
    userData: {
        type: Object,
    }
})

module.exports = mongoose.model('TestSettings', testSettingsSchema)