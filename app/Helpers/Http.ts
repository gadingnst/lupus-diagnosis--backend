import { Request, Response } from 'express'
import HttpError from './HttpError'

export interface HttpResponse<T> {
    code: number,
    status: string,
    message: string,
    error?: boolean,
    data?: T
}

export default class Http {
    public static send<T>(res: Response, data: HttpResponse<T>): Response {
        return res.status(data.code).send({ ...data, error: false })
    }

    public static setError(code: number, status: string, msg: string): void {
        throw new HttpError(code, status, msg)
    }

    public static handleError(req: Request, res: Response, error: Error): Response {
        return HttpError.handle(req, res, error)
    }
}
