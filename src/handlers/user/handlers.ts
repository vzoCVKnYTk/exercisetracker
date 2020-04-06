import { Request, Response } from 'express'
import { createAndSaveUser, getAllUsers, UserCallback } from "./model"

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

