import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as routes from './routes'
import * as handlers from './handlers'

import { initDb } from './database'

const app = express()
const port = process.env.PORT || 3000

initDb()

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.post(routes.add, handlers.newExerciseHandler)
app.post(routes.newUser, handlers.newUserHandler)
app.get(routes.users, handlers.getAllUsersHandler)
app.get(routes.log, handlers.getLogHandler)

// Not found middleware
app.use(handlers.notFoundHandler)

// Error Handling middleware
app.use(handlers.errorHandler)


app.listen(port, () => {
    console.log('Your app is listening on port ' + port)
})