import { Request, Response } from 'express'
import Controller from './Controller'
import History, { HistoryFields } from '../Models/History'

class HistoryController extends Controller {
  protected model: History

  constructor() {
    super()
    this.model = new History()
  }

  public async index(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.model.all()
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
}

export default new HistoryController()
