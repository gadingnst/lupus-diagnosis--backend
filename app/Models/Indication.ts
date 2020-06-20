import Model from './Model'

export interface IndicationFields {
    code: string
    name: string
    description: string
}

export default class Indication extends Model<IndicationFields> {
    protected primaryKey = 'code'

    constructor() {
        super('indications.csv')
    }
}
