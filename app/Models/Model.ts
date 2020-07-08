import FileSystem from 'fs'
import * as CSV from 'fast-csv'
import { DATASET_PATH } from '../../configs'

export default abstract class Model<T> {
    private dataset: string
    private dataext: 'csv' | 'json'
    protected abstract prefixKey: string
    protected abstract primaryKey: string
    protected abstract uniqueKey: string[]

    constructor(datasetName: string) {
        this.dataset = `${DATASET_PATH}/${datasetName}`
        this.dataext = <'csv' | 'json'>datasetName
            .split('.')
            .slice(-1)[0]
    }

    private writeStreams(callback: (err: Error | null | undefined, data: T | null) => void) {
        return {
            'csv': (data: T) => {
                const csvStream = CSV.format()
                const writeStream = FileSystem.createWriteStream(this.dataset, {
                    flags: 'a',
                    mode: 0o666
                })
                csvStream.pipe(writeStream)
                    .on('open', () => {
                        writeStream.write('\n')
                        writeStream.close()
                    })
                    .on('close', () => callback(null, data))
                csvStream.write(data, err => {
                    if (err) callback(err, null)
                })
            },
            'json': (data: T, all: T[]) => {
                const newData: T[] = [...all, data]
                FileSystem.writeFile(this.dataset, JSON.stringify(newData), 'utf-8', err => {
                    if (err) callback(err, null)
                    else callback(null, data)
                })
            }
        }
    }

    private readStreams(callback: (err: Error | null | undefined, data: T[] | null) => void) {
        return {
            'csv': () => {
                const data: T[] = []
                    FileSystem.createReadStream(this.dataset)
                        .pipe(CSV.parse({ headers: true }))
                        .on('data', (row: T) => data.push(row))
                        .on('error', err => callback(err, null))
                        .on('end', () => callback(null, data))
            },
            'json': () => {
                FileSystem.readFile(this.dataset, 'utf-8', (err, data) => {
                    if (err) callback(err, null)
                    else callback(null, JSON.parse(data))
                })
            }
        }
    }

    public all(): Promise<T[]> {
        return this.getData() as Promise<T[]>
    }

    public async findByPk<K>(key: K): Promise<T | null> {
        const data = await this.all()
        return data.find(row => (row as any)[this.primaryKey] == key) || null
    }

    public async insert(row: T): Promise<T | null> {
        const allData = await this.all()
        const keys = allData.map(item => +((item as any)[this.primaryKey] as string).replace(/[^0-9]/g, ''))
        const incrementPk = Math.max(...keys) + 1
        const pk = isFinite(incrementPk) ? incrementPk : 1
        const newPk = this.prefixKey.length ? `${this.prefixKey}${pk}` : pk
        return new Promise<T | null>((resolve, reject) => {
            const data = { [this.primaryKey]: newPk, ...row }
            const write = this.writeStreams((err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
            try {
                write[this.dataext](data, allData)
            } catch {
                reject('File extension not valid. Must csvParser (.csvParser) or JSON (.json)')
            }
        })
    }

    private getData(): Promise<T[] | null> {
        return new Promise<T[] | null>((resolve, reject) => {
            const read = this.readStreams((err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
            try {
                read[this.dataext]()
            } catch {
                reject('File extension not valid. Must csvParser (.csvParser) or JSON (.json)')
            }
        })
    }
}
