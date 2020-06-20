import { Request, Response } from 'express'
import Controller from 'app/Controllers/Controller'
import Case from 'app/Models/Case'

class CaseController extends Controller {
    protected model: Case

    constructor() {
        super()
        this.model = new Case()
    }

    public async post(req: Request, res: Response): Promise<void> {
        const { indications } = req.body
        try {
            const disease = this.model.predict(indications)
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: `Sukses`
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }
}

export default new CaseController()