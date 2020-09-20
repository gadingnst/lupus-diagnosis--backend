import Model from './FSModel'

export interface IndicationFields {
    kode_gejala?: string
    gejala: string
    des_gejala: string
    gambar_gejala: string
}

export default class Indication extends Model<IndicationFields> {
    protected primaryKey = 'kode_gejala'
    protected prefixKey = 'G'
    protected uniqueKey = []

    constructor() {
        super('indications.csv')
    }
}
