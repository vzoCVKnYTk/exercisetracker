import mongoose from 'mongoose'

export type Document = mongoose.Document

export type Callback = (error: any, data?: any) => void;

export const initDb = () => {
    return mongoose.connect('mongodb+srv://klemai:V43AohgkBgKFYCa3G7WQoMihfzaEDXEpcB67sxWn83YzEdjE6AEA8jZeVwBaryyW@jc-freecodecamp-mongo-seo4v.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
}

export const Schema = mongoose.Schema;

export const model = mongoose.model