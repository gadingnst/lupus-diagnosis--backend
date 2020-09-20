import { Request, Response } from 'express'
import Controller from './Controller'
import Visitor, { VisitorFields } from '../Models/Visitor'

class VisitorController extends Controller {
  protected model: Visitor

  constructor() {
    super()
    this.model = new Visitor()
  }

  public async index(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.model.all()
      this.send(res, {
        code: 200,
        status: 'OK!',
        message: `Sukses mengambil ${data.length} data pengunjung.`,
        data
      })
    } catch (err) {
      this.handleError(req, res, err)
    }
  }

  public async add(req: Request, res: Response): Promise<void> {
    const { umur, pekerjaan, jenis_kelamin } = req.body
    const visitor: VisitorFields = { umur, pekerjaan, jenis_kelamin }
    try {
      const data = await this.model.insert(visitor)
      this.send(res, {
        code: 201,
        status: 'Created.',
        message: 'Sukses menambah data pengunjung.',
        data
      })
    } catch (err) {
      this.handleError(req, res, err)
    }
  }
}

export default new VisitorController()
