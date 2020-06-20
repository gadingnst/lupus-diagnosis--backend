import IndicationController from 'app/Controllers/Indication'
import Router from 'routes/Router'

class IndicationRoute extends Router<typeof IndicationController> {
    constructor() {
        super(IndicationController)
    }

    public routes() {
        this.router.get('/', this.bindHandler(IndicationController.index))
        this.router.get('/:code', this.bindHandler(IndicationController.getByCode))
    }
}

export default new IndicationRoute().router