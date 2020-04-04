import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { initDb } from './database'
import { createAndSaveUser, findUserById, getAllUsers, IUser, createExerciseForUser } from './user'
import { createAndSaveExercise, IExercise } from './exercise'
const app = express()


initDb()

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const newExerciseHandler = (
  req: Request, 
  res: Response
) => {
  const {
    userId,
    description,
    duration,
    date,
  } = req.body

  createAndSaveExercise(
    description,
    duration,
    date,
    (error: any, exercise: IExercise) => {
      console.log(`Error: ${error}`) 
      createExerciseForUser(
        userId,
        exercise,
        (error, user) => {
          console.log(`Error: ${error}`) 

          if(error) {
            res.status(500).send('Internal Server error')
          }
          res.json({
            username: user.username,
            description,
            duration,
            _id: user._id,
            date,
          })
        }
      )
  })  
}

app.post('/api/exercise/add', newExerciseHandler)

const newUserHandler = (
  req: Request, 
  res: Response
) => {
  const username = req.body.username
  console.log(username)

  createAndSaveUser(username, (err, data) => {
    if(err) { 
      res.status(500).send('Internal Server Error')
    }
    if(!data) {
      console.log('Missing `done()` argument', data)
      res.status(500).send('Internal Server Error')
    }
    findUserById(data._id, (findError, userObject) => {
      if(findError) { 
        res.status(404).send('Could not find the user with that id')
      }

      const { username, _id } = userObject
      console.log(userObject)

      res.json({ username, _id })
    })
  })
}
app.post('/api/exercise/new-user', newUserHandler)



const getAllUsersHandler = (
  req: Request,
  res: Response,
) => {
  getAllUsers((error, users) => {
    if(error) { 
      res.status(500).send('Internal Server Error')
    }
    if(!users) {
      console.log('Missing `done()` argument', users)
      res.status(500).send('Internal Server Error')
    }
    const userArray = users.map((user: IUser) => {
      return {
        _id: user._id,
        username: user.username
      }
    });

    res.json(userArray)
  })
}

app.get('/api/exercise/users', getAllUsersHandler)

const getLogHandler = (
  req: Request, 
  res: Response
) => {
  const {
    userId,
    from,
    to,
    limit
  } = req.params

  // Parse to and from dates
  // Check to < from

  
  // Get logs with a limit if specified
  console.log(`${userId} ${from} ${to} ${limit}`)

  
}

app.get('/api/exercise/log', getLogHandler)


const notFoundHandler = (
  _req: Request, 
  _res: Response, 
  next: NextFunction
  ) => {
  return next({status: 404, message: 'not found'})
}

// Not found middleware
app.use(notFoundHandler)

const errorHandler = (
  err: any, 
  _req: Request, 
  res: Response, 
  _next: NextFunction
) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
}

// Error Handling middleware
app.use(errorHandler)

const port = process.env.PORT || 3000

const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + port)
})
