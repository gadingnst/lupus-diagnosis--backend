import FeedbackController from '../../app/Controllers/Feedback'
import Router from '../Router'

class FeedbackRoute extends Router<typeof FeedbackController> {
  constructor() {
    super(FeedbackController)
  }

  public routes() {
    this.router.get('/', this.bindHandler(FeedbackController.index))
    this.router.post('/', this.bindHandler(FeedbackController.add))
  }
}

export default new FeedbackRoute().router
