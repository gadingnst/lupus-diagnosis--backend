import AdminController from '../../app/Controllers/Admin'
import Router from '../Router'
import { attempt } from '../../app/Middlewares/Auth'

class AdminRoute extends Router<typeof AdminController> {
    constructor() {
        super(AdminController)
    }

    public routes() {
        this.router.post('/login', this.bindHandler(AdminController.login))
        this.router.post('/register', attempt, this.bindHandler(AdminController.register))
        this.router.get('/info', attempt, this.bindHandler(AdminController.info))
    }
}

export default new AdminRoute().router