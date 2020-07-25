import { Request, Response } from 'express'
import Controller from './Controller'
import Indication, { IndicationFields } from '../Models/Indication'
import { cleanObject } from 'app/Helpers'

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
                message: `Sukses mengambil ${data.length} data gejala.`,
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }

    public async add(req: Request, res: Response) {
        const { gejala, des_gejala } = req.body
        const indication: IndicationFields = { gejala, des_gejala }
        try {
          const data = await this.model.insert(indication)
          this.send(res, {
            code: 201,
            status: 'Created',
            message: 'Sukses menambahkan data gejala.',
            data
          })
        } catch (err) {
          this.handleError(req, res, err)
        }
    }

    public async update(req: Request, res: Response) {
        const { code } = req.params
        const { gejala, des_gejala } = req.body
        try {
            const indication = await this.model.findByPk(code.toUpperCase().trim())
            if (!indication.get()) this.setError(404, 'Not Found.', `Gejala dengan kode ${code} tidak ditemukan.`)
            const data = await indication.update(cleanObject({ gejala, des_gejala }))
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: 'Sukses mengupdate data gejala.',
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }

    public async delete(req: Request, res: Response) {
        const { code } = req.params
        try {
            const indication = await this.model.findByPk(code.toUpperCase().trim())
            if (!indication.get()) this.setError(404, 'Not Found.', `Gejala dengan kode ${code} tidak ditemukan.`)
            const data = await indication.delete()
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: 'Sukses menghapus data gejala.',
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }

    public async getByCode(req: Request, res: Response): Promise<void> {
        const { code } = req.params
        try {
            const data = (await this.model.findByPk(code.toUpperCase().trim())).get()
            if (!data) this.setError(404, 'Not Found.', `Gejala dengan kode ${code} tidak ditemukan.`)
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: 'Sukses mengambil data gejala.',
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }
}

export default new IndicationController()
