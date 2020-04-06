import { Request, Response, NextFunction } from 'express'
import { createAndSaveExercise, IExercise } from './model'
import { createExerciseForUser, findLogByUserId } from '../user/model'
import { IUser } from '../user/model'
import _ from 'lodash'
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
  
    createAndSaveExercise(
      description,
      duration,
      date,
      (error: any, exercise: IExercise) => {
        if(error) {
          res.status(500).send('Internal Server error')
        }
        createExerciseForUser(
          userId,
          exercise,
          (error: any, user: IUser) => {
  
            if(error) {
              res.status(500).send('Internal Server error')
            } else {
              res.json({
                username: user.username,
                description,
                duration,
                _id: user._id,
                date,
              })
            }
          }
        )
    })  
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

    findLogByUserId(userId, (error, data) => {
      if(error) {
        next({ status: 500, message: `Server Error` })
      }

      const exercises = data

      console.log(exercises, 'exercises')

      const hasDates = from && to
    
      const filteredByDate = exercises.filter((exercise: IExercise) => {
        const { date } = exercise
        const startDate = new Date(from)
        const endDate = new Date(to)

        return date > startDate && date < endDate
      })
  
      const filteredLogs = hasDates ? filteredByDate : data.exercise  
  
      const limitedLogs = filteredLogs.slice(0, limit)
  
      const pickedLogs = limitedLogs.map((log: IExercise) => {
        return _.omitBy(log, (_value, key) => {
          console.log(key)
          return key === '__v'
        })
      })

      res.json(pickedLogs)
    })
  
    // Parse to and from dates
    // Check to < from
  
    
    // Get logs with a limit if specified
    // console.log(`${userId} ${from} ${to} ${limit}`)
  
    
  }