import Model from './Model'

export interface DiseaseFields {
    code: string
    name: string
    idName: string
}

export default class Disease extends Model<DiseaseFields> {
    protected primaryKey = 'code'

    constructor() {
        super('diseases.csv')
    }
}
