import FileSystem from 'fs'
import CSV from 'csv-parser'
import { DATASET_PATH } from '../../configs'

export default abstract class Model<T> {
    private dataset: string
    private dataext: string
    protected abstract primaryKey: string

    constructor(datasetName: string) {
        this.dataset = `${DATASET_PATH}/${datasetName}`
        this.dataext = datasetName
            .split('.')
            .slice(-1)[0]
    }

    public all(): Promise<T[]> {
        return this.getData()
    }

    public async findByPk<K>(key: K): Promise<T | null> {
        const data = await this.all()
        return data.find(row => (row as any)[this.primaryKey] === key) || null
    }

    private getData(): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            if (this.dataext === 'csv') {
                const data: T[] = []
                FileSystem.createReadStream(this.dataset)
                    .pipe(CSV())
                    .on('data', (row: T) => data.push(row))
                    .on('error', err => reject(err))
                    .on('end', () => resolve(data))
            } else if (this.dataext === 'json') {
                FileSystem.readFile(this.dataset, 'utf-8', (err, data) => {
                    if (err) reject(err)
                    else resolve(JSON.parse(data))
                })
            } else {
                reject('File extension not valid. Must CSV (.csv) or JSON (.json)')
            }
        })
    }
}
