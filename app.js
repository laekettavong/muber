import express from 'express'
import Router from './routes/router'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/muber', { useNewUrlParser: true })
}

const app = express()
app.use(bodyParser.json())
Router.handleRequests(app)
app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message })
})

module.exports = app