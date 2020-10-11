import { Request, Response } from 'express'
import Controller from './Controller'
import Feedback, { FeedbackFields } from '../Models/Feedback'

class FeedbackController extends Controller {
  protected model: Feedback

  constructor() {
    super()
    this.model = new Feedback()
  }

  public async index(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.model.all()
      this.send(res, {
        code: 200,
        status: 'OK!',
        message: `Sukses mengambil ${data.length} data feedback.`,
        data
      })
    } catch (err) {
      this.handleError(req, res, err)
    }
  }

  public async add(req: Request, res: Response): Promise<void> {
    const { saran, kritik } = req.body
    const feedback: FeedbackFields = { saran, kritik }
    try {
      const data = await this.model.insert(feedback)
      this.send(res, {
        code: 201,
        status: 'Created.',
        message: 'Sukses mengirimkan feedback, Terima Kasih.',
        data
      })
    } catch (err) {
      this.handleError(req, res, err)
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    try {
      const data = await this.model.findByPk(id)
      await data.delete()
      this.send(res, {
        code: 200,
        status: 'Created.',
        message: 'Sukses menghapus feedback.',
        data
      })
    } catch (err) {
      this.handleError(req, res, err)
    }
  }
}

export default new FeedbackController()
