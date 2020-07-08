import Model from './Model'

export interface DiseaseFields {
    code: string
    name: string
    idName: string
}

export default class Disease extends Model<DiseaseFields> {
    protected primaryKey = 'code'
    protected prefixKey = 'P'
    protected uniqueKey = []

    constructor() {
        super('diseases.csv')
    }
}
