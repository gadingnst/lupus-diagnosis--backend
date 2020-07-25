import FileSystem from 'fs'
import * as CSV from 'fast-csv'
import { json2csvAsync } from 'json-2-csv'
import { DATASET_PATH } from '../../configs'
import { HttpError } from 'app/Helpers'

export default abstract class Model<T> {
    private allData: T[]
    private data: T | null
    private dataset: string
    private dataext: 'csv' | 'json'
    protected abstract prefixKey: string
    protected abstract primaryKey: string
    protected abstract uniqueKey: string[]

    constructor(datasetName: string) {
        this.allData = []
        this.data = null
        this.dataset = `${DATASET_PATH}/${datasetName}`
        this.dataext = <'csv' | 'json'>datasetName
            .split('.')
            .slice(-1)[0]
    }

    private writeAllStreams(callback: (error: Error | null | undefined, data: T[]) => void) {
        return {
            'csv': (data: T[]) => json2csvAsync(data as any[])
                .then(result => {
                    FileSystem.writeFile(this.dataset, result + '\n', 'utf-8', err => {
                        if (err) throw err
                        else callback(null, data)
                    })
                })
                .catch(err => callback(err, [])),
            'json': (data: T[]) => {
                const newData: T[] = [...data]
                FileSystem.writeFile(this.dataset, JSON.stringify(newData), 'utf-8', err => {
                    if (err) callback(err, [])
                    else callback(null, data)
                })
            }
        }
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

    private checkUniqueKeys(row: T, allData: T[]): String {
        let duplicateKeys = ''
        if (this.uniqueKey.length) {
            allData.forEach(data => (
                this.uniqueKey.forEach(key => {
                    const exists = (row as any)[key] === (data as any)[key]
                    if (exists) duplicateKeys = key
                })
            ))
        }
        return duplicateKeys
    }

    public get(): T | null {
        return this.data
    }

    public all(): Promise<T[]> {
        return this.getData() as Promise<T[]>
    }

    public async insert(row: T): Promise<T | null> {
        const allData = await this.all()
        const duplicateKey = this.checkUniqueKeys(row, allData)
        if (duplicateKey) throw new HttpError(400, 'Bad Request', `Data duplikat, ${duplicateKey} sudah digunakan`)
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

    public async findByPk<K>(value: K): Promise<Model<T>> {
        this.allData = await this.all()
        this.data = this.allData.find(row => (row as any)[this.primaryKey] == value) || null
        return this
    }

    public async find<K>(field: string, value: K): Promise<Model<T>> {
        this.allData = await this.all()
        this.data = this.allData.find(row => (row as any)[field] == value) || null
        return this
    }

    public async delete(): Promise<T | null> {
        const newData = this.allData.filter(data => (data as any)[this.primaryKey] != (this.data as any)[this.primaryKey])
        return new Promise((resolve, reject) => {
            const write = this.writeAllStreams(err => {
                if (err) reject(err)
                else resolve(this.data)
            })
            try {
                write[this.dataext](newData)
            } catch {
                reject('File extension not valid. Must csvParser (.csvParser) or JSON (.json)')
            }
        })
    }

    public async update(data: Partial<T>): Promise<T | null> {
        const idx = this.allData.findIndex(data => (data as any)[this.primaryKey] == (this.data as any)[this.primaryKey]) || -1
        this.data = { ...this.data, ...data } as T
        this.allData[idx] = this.data as T
        return new Promise((resolve, reject) => {
            const write = this.writeAllStreams(err => {
                if (err) reject(err)
                else resolve(this.data)
            })
            try {
                write[this.dataext](this.allData)
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
