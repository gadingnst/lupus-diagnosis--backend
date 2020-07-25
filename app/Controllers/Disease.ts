import { Request, Response } from 'express'
import Controller from './Controller'
import Disease, { DiseaseFields } from '../Models/Disease'
import { cleanObject } from 'app/Helpers'

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

    public async add(req: Request, res: Response) {
        const { nama_penyakit, des_penyakit } = req.body
        const disease: DiseaseFields = { nama_penyakit, des_penyakit }
        try {
          const data = await this.model.insert(disease)
          this.send(res, {
            code: 201,
            status: 'Created',
            message: 'Sukses menambah data penyakit.',
            data
          })
        } catch (err) {
          this.handleError(req, res, err)
        }
    }

    public async update(req: Request, res: Response) {
        const { code } = req.params
        const { nama_penyakit, des_penyakit } = req.body
        try {
            const disease = await this.model.findByPk(code.toUpperCase().trim())
            if (!disease.get()) this.setError(404, 'Not Found.', `Penyakit dengan kode ${code} tidak ditemukan.`)
            const data = await disease.update(cleanObject({ nama_penyakit, des_penyakit }))
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: 'Sukses mengupdate data penyakit.',
                data
            })
        } catch (err) {
            this.handleError(req, res, err)
        }
    }

    public async delete(req: Request, res: Response) {
        const { code } = req.params
        try {
            const disease = await this.model.findByPk(code.toUpperCase().trim())
            if (!disease.get()) this.setError(404, 'Not Found.', `Penyakit dengan kode ${code} tidak ditemukan.`)
            const data = await disease.delete()
            this.send(res, {
                code: 200,
                status: 'OK!',
                message: 'Sukses menghapus data penyakit.',
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