import Model from './FSModel'

export interface VisitorFields {
  id_pengunjung?: string
  nama_pengunjung: string
}

export default class User extends Model<VisitorFields> {
    protected primaryKey = 'id_pengunjung'
    protected prefixKey = ''
    protected uniqueKey = []

    constructor() {
        super('visitors.csv')
    }
}
