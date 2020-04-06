import { Schema, model, Callback, Document } from '../../database' 

 export interface IExercise extends Document {
    description: string,
    duration: number,
    date: Date
}

export const exerciseSchema = new Schema<IExercise>({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
});

export const Exercise = model<IExercise>("Exercise", exerciseSchema);

export const createAndSaveExercise = (
    description: string, 
    duration: Number,
    date: Date,
    done: Callback
) => {

    const finalDate = !date ? new Date() : date

    const exercise = new Exercise({ 
        description,
        duration,
        date: finalDate,
    })
  
    exercise.save((err, data) => {
        if(err) return done(err);
        done(null, data);
    });
}

export const findExerciseById = (id: string, done: Callback) => Exercise.findById(id, done);