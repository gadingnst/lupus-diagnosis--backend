import DiseaseController from 'app/Controllers/Disease'
import Router from 'routes/Router'

class DiseaseRoute extends Router<typeof DiseaseController> {
    constructor() {
        super(DiseaseController)
    }

    public routes() {
        this.router.get('/', this.bindHandler(DiseaseController.index))
        this.router.get('/:code', this.bindHandler(DiseaseController.getByCode))
    }
}

export default new DiseaseRoute().router