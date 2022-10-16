const mongoose = require('mongoose')
const testSchema = new mongoose.Schema({

})

module.exports = mongoose.model('Test', testSchema)

let settings = {
    type: testTypes.test1,
    name: 'test1',
    domain: 'test1.com',
    description: 'test1 description',
    help: 'test1 help',
    image: 'test1 image',
    color: [
        {
            mainColor: 'red',
            secondaryColor: 'blue',
            tertiaryColor: 'green'
        }
    ],
}

let questions = {
    type: testTypes.test1,
    domain: 'test1.com',
    questions: [
        {
            id: '1',
            group: {
                name: 'group1',
                description: 'group1 description',
            },
            question: 'test1 question 1',
            answers: [
                {
                    id: '1',
                    answer: 'test1 answer 1'
                },
                {
                    id: '2',
                    answer: 'test1 answer 2'
                },
                {
                    id: '3',
                    answer: 'test1 answer 3'
                },
            ],
        },
        {
            id: '2',
            question: 'test1 question 2',
            group: {
                name: 'group2',
                description: 'group2 description',
            },
            answers: [
                {
                    id: '1',
                    answer: 'test1 answer 1'
                },
                {
                    id: '2',
                    answer: 'test1 answer 2'
                },
                {
                    id: '3',
                    answer: 'test1 answer 3'
                },
            ]
        }
    ]
}