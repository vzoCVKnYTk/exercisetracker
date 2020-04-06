import { newUserHandler, getAllUsersHandler, newExerciseHandler, getLogHandler } from './user/handlers'
import { errorHandler, notFoundHandler } from './error/handlers'

export {
  newExerciseHandler,
  getLogHandler,
  newUserHandler,
  getAllUsersHandler,
  errorHandler,
  notFoundHandler
}