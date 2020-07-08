import Router from '../Router'
import DiseaseRoute from './Disease'
import IndicationRoute from './Indication'
import CaseRoute from './Case'
import UserRoute from './User'

class ApiRoute extends Router {
    public routes() {
        this.router.use('/diseases', DiseaseRoute)
        this.router.use('/indications', IndicationRoute)
        this.router.use('/cases', CaseRoute)
        this.router.use('/users', UserRoute)
    }
}

export default new ApiRoute().router