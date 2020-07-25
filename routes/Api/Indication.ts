import IndicationController from '../../app/Controllers/Indication'
import Router from '../Router'
import { attempt } from '../../app/Middlewares/Auth'

class IndicationRoute extends Router<typeof IndicationController> {
    constructor() {
        super(IndicationController)
    }

    public routes() {
        this.router.get('/', this.bindHandler(IndicationController.index))
        this.router.get('/:code', this.bindHandler(IndicationController.getByCode))
        this.router.post('/', attempt, this.bindHandler(IndicationController.add))
        this.router.put('/:code', attempt, this.bindHandler(IndicationController.update))
        this.router.delete('/:code', attempt, this.bindHandler(IndicationController.delete))
    }
}

export default new IndicationRoute().router