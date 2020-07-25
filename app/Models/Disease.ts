import Model from './FSModel'

export interface DiseaseFields {
    kode_penyakit?: string
    nama_penyakit: string
    des_penyakit: string
}

export default class Disease extends Model<DiseaseFields> {
    protected primaryKey = 'kode_penyakit'
    protected prefixKey = 'P'
    protected uniqueKey = []

    constructor() {
        super('diseases.csv')
    }
}
