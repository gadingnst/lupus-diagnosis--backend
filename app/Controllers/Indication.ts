import { Request, Response } from 'express'
import Controller from './Controller'
import Indication from '../Models/Indication'

class IndicationController extends Controller {
    protected model: Indication

    constructor() {
        super()
        this.model = new Indication()
    }

    public async index(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.model.all()

            this.send(res, {
                code: 200,
                status: 'OK!',
                message: `Sukses mengambil ${data.length} data gejala penyakit`,
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
            if (!data) this.setError(404, 'Not Found.', `Gejala penyakit dengan kode ${code} tidak ditemukan.`)
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: 'Sukses mengambil data gejala penyakit.',
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }
}

export default new IndicationController()
