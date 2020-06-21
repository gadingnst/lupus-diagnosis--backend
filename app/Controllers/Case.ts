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
            if (!indications) this.setError(400, 'Bad Request', 'Harus mengirimkan parameter gejala untuk memprediksi penyakit.')
            const data = await this.model.predict(indications.split(','))
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: `Sukses`,
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }
}

export default new CaseController()