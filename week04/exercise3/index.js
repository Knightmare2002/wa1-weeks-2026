import express from 'express'
import morgan from 'morgan'
import { getUsers, getQuestions, getQuestion, addQuestion } from './dao.js'
import { Question } from './entities.js'

import { param, body, validationResult } from 'express-validator'

const app = express()

const log = morgan('dev')
app.use(log)
app.use(express.json())

function errorResponse(err) {
    return {
        "error": err.message
    }
}


const PREFIX = '/api/v1'

// GET /questions

app.get(PREFIX + '/questions', (req, res) => {
    getQuestions().then(questions => res.json(questions))
        .catch(err => res.status(500).json(errorResponse(err)))
})

// GET /questions/:id

app.get(PREFIX + '/questions/:id', param('id').isNumeric(), async (req, res) => {

    if (validationResult(req).isEmpty()) {

        const id = req.params.id

        try {
            const question = await getQuestion(id)
            res.json(question)
        } catch (err) {
            console.log(err)
            res.status(500).json(errorResponse(err))
        }
    } else {
        res.status(500).json(validationResult(req).array())
    }

})

// POST /questions

app.post(PREFIX + '/questions', [
    body('text').isString(),
    body('authorId').isNumeric(),
    body('date').isDate()
], async (req, res) => {
    if (validationResult(req).isEmpty()) {

        const raw_question = req.body
        const question = new Question(raw_question.id, raw_question.text, raw_question.authorId, raw_question.date)
        try {
            const id = await addQuestion(question)
            res.json({ id: id })
        } catch (err) {
            res.status(500).json(errorResponse(err))
        }
    } else {
        res.status(500).json(validationResult(req).array())
    }
})

app.listen(3000, () => { console.log('server started') })

