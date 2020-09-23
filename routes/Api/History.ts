import HistoryController from '../../app/Controllers/History'
import Router from '../Router'

class HistoryRoute extends Router<typeof HistoryController> {
  constructor() {
    super(HistoryController)
  }

  public routes() {
    this.router.get('/', this.bindHandler(HistoryController.index))
  }
}

export default new HistoryRoute().router
