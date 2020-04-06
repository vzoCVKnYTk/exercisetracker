import { Schema, Callback, model, Document } from '../../database'
import mongoose, { Types } from 'mongoose'
export interface Exercise {
    _id: Types.ObjectId,
    description: string,
    duration: number,
    date: string
}

export interface IUser extends Document {
    username: string,
    exercise?: Exercise[]
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    exercise: [{
        description: { type: String, required: true },
        duration: { type: Number, required: true },
        date: { type: Date }
    }],
});

const User = model<IUser>("User", userSchema);

const createUser = (username: string) => new User({ username })

export type UserCallback = (err: any, product: IUser) => void

const findExerciseById = (exerciseId: string | number, done?: Callback) => {}

export const createAndSaveUser = (username: string, done: UserCallback) => {
    createUser(username).save((err: any, user: IUser) => {
        if(err) {
            return done(err, null)
        }

        findUser(user._id, done)
    })
}

export const findUser = (
    id: string, 
    done?: Callback,
) => User.findById(id)
        .exec(done)

export interface Options {
    limit: number,
    to: string,
    from: string
}

export const findExercisesWithUserId = (id: string, done?: Callback) => User.find({ id }).select('exercise').exec(done)

export const createExerciseForUser = (userId: string, exercise: Exercise, done: Callback) => {
    findUser(userId, (error, user) => {
        if(error) {
            done(error)
        }

        let modifiedExercise = exercise
        if(!modifiedExercise.date) {
            const now = new Date()
            const prependZero = (number: number) => number < 10 ? `0${number}` : number
            const nowString = `${now.getFullYear()}-${prependZero(now.getMonth() + 1)}-${prependZero(now.getDate())}`
            modifiedExercise.date = nowString
            modifiedExercise._id = mongoose.Types.ObjectId()
        }
        
        user.exercise.push(modifiedExercise)

        user.save((err: any, savedUser: any) => {
            console.log("error", err)
            console.log("savedUser", savedUser)

            if(err) {
                done(err)
            }

            done(null, { user: savedUser , exercise })
        })
    })
}

export const findLogsByUserId = (userId: string, options?: Options, done?: Callback) => {
    console.log('UserId', userId)
    findUser(userId, (error, data) => {
        console.log('error', error)
        console.log('findUserData', data)

        if(error) done(error)
        if(!data) {
            done(error)
        }

        console.log('data.exercise', data.exercise)

        const { to, from, limit } = options
        const exercises = data.exercise

        const hasDates = from && to
      
        const filteredByDate = exercises.filter((exercise: Exercise) => {
          const { date } = exercise
          const suppliedDate = new Date(date)
          const startDate = new Date(from)
          const endDate = new Date(to)
  
          return suppliedDate > startDate && suppliedDate < endDate
        })

        console.log('filteredByDate', filteredByDate)
    
        const filteredLogs = hasDates ? filteredByDate : data.exercise  
    
        const limitedLogs = filteredLogs.slice(0, limit)

        const finalLogs: Exercise[] = limitedLogs.map((log: Exercise) => {
          return {
            _id: log._id,
            duration: log.duration,
            description: log.description,
            date: new Date(log.date).toDateString()
          }
        });
     
        console.log('limitedLogs', finalLogs)
  
        findUser(userId, (error, data) => {
            if(error) { return done(error) }

            const finalData = {
                _id: data._id,
                username: data.username,
                count: finalLogs.length,
                log: finalLogs
            }

            done(null, finalData)
        })


    })
}

export const getAllUsers = (done?: Callback) => User.find({}).select('username').exec(done)