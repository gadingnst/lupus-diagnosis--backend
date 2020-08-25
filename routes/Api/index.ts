import Router from '../Router'
import DiseaseRoute from './Disease'
import IndicationRoute from './Indication'
import CaseRoute from './Case'
import AdminRoute from './Admin'
import VisitorRoute from './Visitor'

class ApiRoute extends Router {
    public routes() {
        this.router.use('/diseases', DiseaseRoute)
        this.router.use('/indications', IndicationRoute)
        this.router.use('/cases', CaseRoute)
        this.router.use('/admins', AdminRoute)
        this.router.use('/visitors', VisitorRoute)
    }
}

export default new ApiRoute().router