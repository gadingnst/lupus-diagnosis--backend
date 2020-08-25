import DiseaseController from '../../app/Controllers/Disease'
import Router from '../Router'
import { attempt } from '../../app/Middlewares/Auth'

class DiseaseRoute extends Router<typeof DiseaseController> {
    constructor() {
        super(DiseaseController)
    }

    public routes() {
        this.router.get('/', this.bindHandler(DiseaseController.index))
        this.router.get('/:code', this.bindHandler(DiseaseController.getByCode))
        this.router.post('/', attempt, this.bindHandler(DiseaseController.add))
        this.router.put('/:code', attempt, this.bindHandler(DiseaseController.update))
        this.router.delete('/:code', attempt, this.bindHandler(DiseaseController.delete))
    }
}

export default new DiseaseRoute().router