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
        // indications adalah variable yang mengumpulkan kode gejala
        const { indications = '' } = req.query
        try {
            // Memanggil fungsi predict di file model (/app/Models/Case.ts)
            // dengan mempassing parametter kode gejala tadi yang diubah menjadi array.
            const data = await this.model.predict((<string>indications).split(','))
            
            // mengirim data ke client
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