import Router from '../Router'
import DiseaseRoute from './Disease'
import IndicationRoute from './Indication'
import CaseRoute from './Case'

class ApiRoute extends Router {
    public routes() {
        this.router.use('/diseases', DiseaseRoute)
        this.router.use('/indications', IndicationRoute)
        this.router.use('/cases', CaseRoute)
    }
}

export default new ApiRoute().router