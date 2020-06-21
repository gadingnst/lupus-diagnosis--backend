import { Request, Response } from 'express'
import Http, { HttpResponse } from '../Helpers/Http'
import HttpError from '../Helpers/HttpError'

export default abstract class Controller<T extends object = object> {
    protected abstract model: T

    protected send<T>(res: Response, data: HttpResponse<T>): Response {
        return Http.send(res, data)
    }

    protected setError(code: number, status: string, msg: string): void {
        throw new HttpError(code, status, msg)
    }

    protected handleError(req: Request, res: Response, error: Error): Response {
        return HttpError.handle(req, res, error)
    }
}