import { Request, Response } from 'express'
import Controller from './Controller'
import Case from '../Models/Case'
import History from '../Models/History'

class CaseController extends Controller {
    protected model: Case
    protected history: History

    constructor() {
        super()
        this.model = new Case()
        this.history = new History()
    }

    public async indexHistory(req: Request, res: Response): Promise<void> {
        try {
          const data = await this.history.all()
          this.send(res, {
            code: 200,
            status: 'OK!',
            message: `Sukses mengambil ${data.length} data riwayat prediksi.`,
            data
          })
        } catch (err) {
          this.handleError(req, res, err)
        }
    }

    public async predict(req: Request, res: Response): Promise<void> {
        // indications adalah variable yang mengumpulkan kode gejala
        const { indications: input = '' } = req.query
        const { visitor } = req.body
        const indications = (<string>input).toUpperCase().split(',')
        try {
            // validasi data pengunjung
            if (!visitor) throw new Error('Data pengunjung harus di isi!')

            // Memanggil fungsi predict di file model (/app/Models/Case.ts)
            // dengan mempassing parametter kode gejala tadi yang diubah menjadi array.
            const data = await this.model.predict(indications)
            
            // menambahkan ke tabel history
            await this.history.insert({ visitor, indications, result: data })

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