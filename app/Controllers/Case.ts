import { Request, Response } from 'express'
import Controller from './Controller'
import Case from '../Models/Case'

class CaseController extends Controller {
    protected model: Case

    constructor() {
        super()
        this.model = new Case()
    }

    public async predict(req: Request, res: Response): Promise<void> {
        const { indications = '' } = req.query
        try {
            const data = await this.model.predict((<string>indications).split(','))
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: 'Sukses memprediksi penyakit.',
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }
}

export default new CaseController()