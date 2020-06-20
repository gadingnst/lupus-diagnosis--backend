import CaseController from 'app/Controllers/Case'
import Router from 'routes/Router'

class CaseRoute extends Router<typeof CaseController> {
    constructor() {
        super(CaseController)
    }

    public routes() {
        this.router.post('/', this.bindHandler(CaseController.post))
    }
}

export default new CaseRoute().router