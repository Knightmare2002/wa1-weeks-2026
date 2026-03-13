import express from 'express'
import morgan from 'morgan'
import { getUsers } from './db.js'

const app = express()

const log = morgan('dev')
app.use(log)

app.use(express.json())

app.get('/', (req, res)=>{
    res.send("Hello there!")
})

app.get('/user', (req, res) => {
    const user = {
        name: 'Fulvio',
        id: 42
    } // should come from database

    res.json(user)
})

app.get('/info', (req,res) => {
    const parameters = req.query 
    console.log(parameters)
    res.end()
})

app.post('/newuser', (req,res)=>{
    console.log(req.body)
    res.end()
})

app.get('/user/:id/:type', (req, res) => {
    console.log(req.params)
    res.end()
})

app.get('/users', (req, res) => {
    getUsers().then( users=> res.json(users))
})

app.listen(3000, () => { console.log('server started')})