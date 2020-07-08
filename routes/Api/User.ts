import UserController from '../../app/Controllers/User'
import Router from '../Router'

class CaseRoute extends Router<typeof UserController> {
    constructor() {
        super(UserController)
    }

    public routes() {
        this.router.post('/register', this.bindHandler(UserController.register))
    }
}

export default new CaseRoute().router