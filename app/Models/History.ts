import Model from './FSModel'
import { VisitorFields } from './Visitor'
import { Prediction } from './Case'

export interface HistoryFields {
  id?: string
  visitor: VisitorFields
  indications: string[]
  result: Prediction
}

export default class Feedback extends Model<HistoryFields> {
  protected primaryKey = 'id'
  protected prefixKey = ''
  protected uniqueKey = []

  constructor() {
    super('history.json')
  }
}
