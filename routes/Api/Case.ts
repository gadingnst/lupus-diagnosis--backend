import CaseController from '../../app/Controllers/Case'
import Router from '../Router'

class CaseRoute extends Router<typeof CaseController> {
    constructor() {
        super(CaseController)
    }

    public routes() {
        this.router.post('/predict', this.bindHandler(CaseController.predict))
        this.router.get('/history', this.bindHandler(CaseController.historyIndex))
        this.router.delete('/history/:id', this.bindHandler(CaseController.historyDelete))
    }
}

export default new CaseRoute().router