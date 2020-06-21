import CaseController from '../../app/Controllers/Case'
import Router from '../Router'

class CaseRoute extends Router<typeof CaseController> {
    constructor() {
        super(CaseController)
    }

    public routes() {
        this.router.get('/predict', this.bindHandler(CaseController.predict))
    }
}

export default new CaseRoute().router