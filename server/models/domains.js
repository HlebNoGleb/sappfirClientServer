const mongoose = require('mongoose')
const domainsScheme = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('domains', domainsScheme)