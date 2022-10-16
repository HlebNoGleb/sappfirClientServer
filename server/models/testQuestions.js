const mongoose = require('mongoose')
const testQuestionSchema = new mongoose.Schema({
    type: {
        type: Object,
        required: true,
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    questions: [
        {
            id: {
                type: Number,
                required: true,
            },
            value: {
                type: String,
                required: true,
            }
        }
    ],
    answers: [
        {
            id: {
                type: Number,
                required: true,
            },
            value: {
                type: String,
                required: true,
            }
        }
    ],
})

testQuestionSchema.index({ type: 1, testId: 1}, { unique: true });

module.exports = mongoose.model('TestQuestions', testQuestionSchema)