import Model from './FSModel'

export interface FeedbackFields {
  id?: string
  kritik: string
  saran: string
}

export default class Feedback extends Model<FeedbackFields> {
  protected primaryKey = 'id'
  protected prefixKey = ''
  protected uniqueKey = []

  constructor() {
    super('feedback.csv')
  }
}
