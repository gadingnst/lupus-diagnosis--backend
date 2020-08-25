import { Request, Response } from 'express'
import Controller from './Controller'
import Visitor, { VisitorFields } from '../Models/Visitor'

class VisitorController extends Controller {
  protected model: Visitor

  constructor() {
    super()
    this.model = new Visitor()
  }

  public async add(req: Request, res: Response): Promise<void> {
    const { nama_pengunjung } = req.body
    const visitor: VisitorFields = { nama_pengunjung }
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
