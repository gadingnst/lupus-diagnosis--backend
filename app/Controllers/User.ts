import { Request, Response } from 'express'
import Controller from './Controller'
import User, { UserFields } from '../Models/User'
import { hash } from 'bcryptjs'

class UserController extends Controller {
    protected model: User

    constructor() {
        super()
        this.model = new User()
    }

    public async register(req: Request, res: Response): Promise<void> {
        const { username, name, email, password: plainPassword, birth, gender } = req.body
        const password = await hash(plainPassword, 10)
        const user: UserFields = { username, name, email, password, birth, gender }
        try {
          const data = await this.model.insert(user)
          this.send(res, {
            code: 201,
            status: 'Created',
            message: 'Sukses mendaftar.',
            data
          })
        } catch (err) {
          this.handleError(req, res, err)
        }
    }
}

export default new UserController()