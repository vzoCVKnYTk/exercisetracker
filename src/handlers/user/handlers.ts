import { 
  Request, 
  Response, 
  NextFunction 
} from 'express'
import { 
  createAndSaveUser, 
  getAllUsers, 
  UserCallback, 
  createExerciseForUser,
  findLogsByUserId,
  Exercise
} from "./model"

export const newUserHandler = (
    req: Request, 
    res: Response
  ) => {
    const username = req.body.username
  
    const callback: UserCallback = (err, user)  => {
      if(err) { 
        res.status(500).send('Internal Server Error')
      }
      if(!user) {
        console.log('Missing `done()` argument', user)
        res.status(500).send('Internal Server Error')
      }

      const { username, _id } = user
      res.json({ username, _id })
    }

    createAndSaveUser(username, callback)
  }

  export const getAllUsersHandler = (
    _req: Request,
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
  
      res.json(users)
    })
  }

  import _ from 'lodash'
import { log } from '../../routes'
  export const newExerciseHandler = (
      req: Request, 
      res: Response
    ) => {
      const {
        userId,
        description,
        duration,
        date,
      } = req.body
    
      const exercise: Exercise = {
        _id: null,
        description,
        duration,
        date
      }
  
      createExerciseForUser(
        userId,
        exercise,
        (error: any, data: any ) => {
          if(error) {
            res.status(500).send('Internal Server error')
          } else {
            console.log("data", data)
            res.json({
              username: data.user.username,
              description: data.exercise.description,
              duration: parseInt(data.exercise.duration),
              _id: data.user._id,
              date: new Date(data.exercise.date).toDateString(),
            })
          }
        }
      )
    }
  
    export const getLogHandler = (
      req: Request, 
      res: Response,
      next: NextFunction
    ) => {
      const {
        userId,
        from,
        to,
        limit
      } = req.query
  
      // Validate query
  
      if(!userId) {
        return next({ status: 404, message: `User with id ${userId} not found` })
      }

      const options = {
        from, 
        to,
        limit
      }
  
      findLogsByUserId(userId, options, (error, data) => {
        if(error) {
          next({ status: 500, message: `Server Error` })
        }
  
  
        res.json(data)        
      })
    
      // Parse to and from dates
      // Check to < from
    
      
      // Get logs with a limit if specified
      // console.log(`${userId} ${from} ${to} ${limit}`)
    
      
    }