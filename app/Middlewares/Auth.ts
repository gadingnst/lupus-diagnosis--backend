import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import Http from '../Helpers/Http'

export const attempt = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  try {
    if (!authorization) Http.setError(401, 'Unauthorized', 'Token belum di set.')
    try {
      const token = authorization?.split(/\s+/)[1]
      res.locals.data = verify(token as string, process.env.SECRET_KEY)
      next()
    } catch {
      Http.setError(401, 'Unauthorized', 'Token tidak valid.')
    }
  } catch (err) {
    Http.handleError(req, res, err)
  }
}