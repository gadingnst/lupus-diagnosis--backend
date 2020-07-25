import Model from './FSModel'

export interface AdminFields {
    id_admin?: string
    username: string
    password: string
    email: string
}

export default class User extends Model<AdminFields> {
    protected primaryKey = 'id_admin'
    protected prefixKey = ''
    protected uniqueKey = ['username', 'email']

    constructor() {
        super('admins.csv')
    }
}
