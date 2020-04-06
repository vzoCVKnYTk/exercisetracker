import { Schema, Callback, model, Document } from '../../database'
import { exerciseSchema, IExercise } from '../exercise/model'

export interface IUser extends Document {
    username: string,
    exercise?: IExercise[]
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    exercise: [exerciseSchema],
});

const User = model<IUser>("User", userSchema);

const createUser = (username: string) => new User({ username })

export type UserCallback = (err: any, product: IUser) => void

export const createAndSaveUser = (username: string, done: UserCallback) => {
    createUser(username).save((err: any, user: IUser) => {
        if(err) {
            return done(err, null)
        }

        findUser({ _id: user._id }, done, 'username')
    })
}

export const findUser = (
    id: Object, 
    done?: Callback,
    select?: string,
) => User.find(id)
        .select(select)
        .exec(done)

export interface Options {
    limit: number,
    to: string,
    from: string
}

export const findExercisesWithUserId = (id: string, done?: Callback) => User.find({ id }).select('exercise').exec(done)

export const createExerciseForUser = (userId: string, exercise: IExercise, done: Callback) => {
    findUser({ _id: userId }, (error, user) => {
        if(error) {
            done(error)
        }
        
        user.exercise.push(exercise)

        user.save((err: any, data: any) => {
            if(err) {
                done(err)
            }
            done(null, data);
        })
    })
}

export const findLogByUserId = (userId: string, done?: Callback) => {
    console.log('UserId', userId)
    findUser({ _id: userId }, (error, data) => {
        if(error) done(error)
        if(!data) {
            done(new Error())
        }

        console.log('data[0].exercise', data[0].exercise)

        done(null, data[0].exercise)
    })
}

export const getAllUsers = (done?: Callback) => User.find({}).select('username').exec(done)