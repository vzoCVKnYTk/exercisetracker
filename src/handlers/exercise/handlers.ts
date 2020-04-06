// import { Request, Response, NextFunction } from 'express'
// import { createExerciseForUser, findLogByUserId, Exercise } from '../user/model'
// import _ from 'lodash'
// export const newExerciseHandler = (
//     req: Request, 
//     res: Response
//   ) => {
//     const {
//       userId,
//       description,
//       duration,
//       date,
//     } = req.body
  
//     const exercise = {
//       description,
//       duration,
//       date
//     }

//     createExerciseForUser(
//       userId,
//       exercise,
//       (error: any, data: any ) => {
//         if(error) {
//           res.status(500).send('Internal Server error')
//         } else {

//           res.json({
//             username: data.user.username,
//             description: data.exercise.description,
//             duration: data.exercise.duration,
//             _id: data.user._id,
//             date: data.savedExercise.date,
//           })
//         }
//       }
//     )
//   }

//   export const getLogHandler = (
//     req: Request, 
//     res: Response,
//     next: NextFunction
//   ) => {
//     const {
//       userId,
//       from,
//       to,
//       limit
//     } = req.query

//     // Validate query

//     if(!userId) {
//       return next({ status: 404, message: `User with id ${userId} not found` })
//     }

//     findLogByUserId(userId, (error, data: Exercise[]) => {
//       if(error) {
//         next({ status: 500, message: `Server Error` })
//       }

//       const exercises = data

//       console.log(exercises, 'exercises')

//       const hasDates = from && to
    
//       const filteredByDate = exercises.filter((exercise: Exercise) => {
//         const { date } = exercise
//         const suppliedDate = new Date(date)
//         const startDate = new Date(from)
//         const endDate = new Date(to)

//         return suppliedDate > startDate && suppliedDate < endDate
//       })
  
//       const filteredLogs = hasDates ? filteredByDate : exercises  
  
//       const limitedLogs = filteredLogs.slice(0, limit)
  
//       const pickedLogs = limitedLogs.map((log: Exercise) => {
//         return _.omitBy(log, (_value, key) => {
//           console.log(key)
//           return key === '__v'
//         })
//       })

//       res.json(pickedLogs)
//     })
  
//     // Parse to and from dates
//     // Check to < from
  
    
//     // Get logs with a limit if specified
//     // console.log(`${userId} ${from} ${to} ${limit}`)
  
    
//   }