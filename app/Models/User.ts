import Model from './Model'

export interface UserFields {
    id?: string
    username: string
    name: string
    password: string
    email: string
    birth: string
    gender: 'L' | 'P'
}

export default class User extends Model<UserFields> {
    protected primaryKey = 'id'
    protected prefixKey = ''
    protected uniqueKey = ['username']

    constructor() {
        super('users.csv')
    }
}
