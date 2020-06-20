import { Request, Response } from 'express'
import Controller from 'app/Controllers/Controller'
import Disease from 'app/Models/Disease'

class DiseaseController extends Controller {
    protected model: Disease

    constructor() {
        super()
        this.model = new Disease()
    }

    public async index(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.model.all()

            this.send(res, {
                code: 200,
                status: 'OK!',
                message: `Sukses mengambil ${data.length} data penyakit`,
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }

    public async getByCode(req: Request, res: Response): Promise<void> {
        const { code } = req.params
        try {
            const data = await this.model.findByPk(code.toUpperCase().trim())
            if (!data) this.setError(404, 'Not Found.', `Penyakit dengan kode ${code} tidak ditemukan.`)
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: 'Sukses mengambil data penyakit.',
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }
}

export default new DiseaseController()