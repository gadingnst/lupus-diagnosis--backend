import { Request, Response } from 'express'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import Controller from './Controller'
import Admin, { AdminFields } from '../Models/Admin'

class AdminController extends Controller {
    protected model: Admin

    constructor() {
        super()
        this.model = new Admin()
    }

    public async register(req: Request, res: Response): Promise<void> {
        const { username, email, password: plainPassword } = req.body
        const password = await hash(plainPassword, 10)
        const user: AdminFields = { username, email, password }
        try {
          const data = await this.model.insert(user)
          this.send(res, {
            code: 201,
            status: 'Created.',
            message: 'Sukses mendaftar admin.',
            data
          })
        } catch (err) {
          this.handleError(req, res, err)
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
      const { username, password } = req.body
      try {
        const row = await this.model.find('username', username)
        const admin = row.get()
        if (!admin) this.setError(404, 'Not Found.', `Admin dengan username ${username} tidak ditemukan.`)
        if (!(await compare(password, admin?.password as string))) this.setError(401, 'Unauthorized', 'Password salah.')
        this.send(res, {
          code: 200,
          status: 'OK!',
          message: 'Sukses Login.',
          data: {
            token: sign({ ...admin }, process.env.SECRET_KEY)
          }
        })
      } catch (err) {
        this.handleError(req, res, err)
      }
    }

    public async info(req: Request, res: Response) {
      const { data } = res.locals
      this.send(res, {
        code: 200,
        status: 'OK!',
        message: 'Sukses mendapatkan info admin',
        data
      })
    }
}

export default new AdminController()
