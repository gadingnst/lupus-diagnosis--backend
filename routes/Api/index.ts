import Router from '../Router'
import DiseaseRoute from './Disease'
import IndicationRoute from './Indication'
import CaseRoute from './Case'
import AdminRoute from './Admin'
import VisitorRoute from './Visitor'
import FeedbackRoute from './Feedback'
import HistoryRoute from './History'

class ApiRoute extends Router {
    public routes() {
        this.router.use('/diseases', DiseaseRoute)
        this.router.use('/indications', IndicationRoute)
        this.router.use('/cases', CaseRoute)
        this.router.use('/admins', AdminRoute)
        this.router.use('/visitors', VisitorRoute)
        this.router.use('/feedbacks', FeedbackRoute)
        this.router.use('/histories', HistoryRoute)
    }
}

export default new ApiRoute().router