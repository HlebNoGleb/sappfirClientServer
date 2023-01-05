const mongoose = require('mongoose')
const settingsScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    domainId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    testTypeId: {
        type: Number,
        required: true,
    },
    help: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    color: {
        type: Object,
        required: true,
    },
    userData: {
        Name: {
            type: Boolean,
            required: true,
        },
        FName: {
            type: Boolean,
            required: true,
        },
        Email: {
            type: Boolean,
            required: true,
        },
        Phone: {
            type: Boolean,
            required: true,
        },
        Age: {
            type: Boolean,
            required: true,
        },
        Sex: {
            type: Boolean,
            required: true,
        },
        AgreeFL: {
            type: Boolean,
            required: true,
        },
    },
    resultSettings:{
        VerticalMode: {
            type: Boolean,
            required: true,
        },
        Chart: {
            type: Boolean,
            required: true,
        },
        Info: {
            type: Boolean,
            required: true,
        },
        ClientInfo: {
            type: Boolean,
            required: true,
        },
        AfterTextToggle: {
            type: Boolean,
            required: true,
        },
        AfterText: {
            type: String,
        }
    },
})

module.exports = mongoose.model('Settings', settingsScheme)