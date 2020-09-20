import VisitorController from '../../app/Controllers/Visitor'
import Router from '../Router'

class VisitorRoute extends Router<typeof VisitorController> {
  constructor() {
    super(VisitorController)
  }

  public routes() {
    this.router.get('/', this.bindHandler(VisitorController.index))
    this.router.post('/', this.bindHandler(VisitorController.add))
  }
}

export default new VisitorRoute().router
