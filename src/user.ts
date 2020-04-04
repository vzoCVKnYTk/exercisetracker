import { Schema, Callback, model, Document } from './database'
import { exerciseSchema, IExercise } from './exercise'

export interface IUser extends Document {
    username: string,
    exercise?: IExercise[]
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    exercise: [exerciseSchema],
});

const User = model<IUser>("User", userSchema);

export const createAndSaveUser = (username: string, done: Callback) => {
    const user = new User({ username })
  
    user.save((err, data) => {
        if(err) return done(err);
        done(null, data);
    });
}

export const findUserById = (id: string, done?: Callback) => User.findById(id, done);

export const createExerciseForUser = async (userId: string, exercise: IExercise, done: Callback) => {
    const user = await findUserById(userId)

    user.exercise.push(exercise)

    user.save((err, data) => {
        if(err) return done(err);
        done(null, data);
    });
}

export const getAllUsers = (done?: Callback) => User.find({}, done)