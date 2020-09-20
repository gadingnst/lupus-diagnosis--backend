import Model from './FSModel'

export interface VisitorFields {
  id_pengunjung?: string
  umur: string
  jenis_kelamin: 'L'|'P'
  pekerjaan: string
}

export default class Visitor extends Model<VisitorFields> {
  protected primaryKey = 'id_pengunjung'
  protected prefixKey = ''
  protected uniqueKey = []

  constructor() {
    super('visitors.csv')
  }
}
