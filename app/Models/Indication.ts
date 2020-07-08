import Model from './Model'

export interface IndicationFields {
    code: string
    name: string
    description: string
}

export default class Indication extends Model<IndicationFields> {
    protected primaryKey = 'code'
    protected prefixKey = 'G'
    protected uniqueKey = []

    constructor() {
        super('indications.csv')
    }
}
