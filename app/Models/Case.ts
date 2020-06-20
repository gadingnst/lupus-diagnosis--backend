import Model from './Model'
import Disease, { DiseaseFields } from './Disease'
import Indication, { IndicationFields } from './Indication'

export interface CaseFields {
    id: string
    disease: string
    indications: string[]
}

export interface Prior {
    [code: string]: {
        sample: number
        amount: number
    }
}

export interface Probability {
    totalCase: number
    prior: Prior
}

export interface IndicationSample {
    [indication: string]: {
        positive: number
        negative: number
    }
}

export interface Classification {
    disease: string
    sample: number
    indication: IndicationSample
}

export default class Case extends Model<CaseFields> {
    protected primaryKey = 'id'
    private disease: Disease
    private indication: Indication

    constructor() {
        super('train.json')
        this.disease = new Disease()
        this.indication = new Indication()
    }

    public async predict(input: string[]): Promise<any> {
        input = input.map(indication => indication.toUpperCase().trim())
        const [cases, diseases, indications] = await Promise.all([
            this.all(),
            this.disease.all(),
            this.indication.all()
        ])

        const priors = this.getProbability(cases, diseases)
        const classification = this.classify('P1', cases, indications);
    }

    public async filterByDisease(disease: string): Promise<CaseFields[]> {
        const data = await this.all()
        return data.filter((train: CaseFields) => train.disease === disease.toUpperCase().trim())
    }

    private classify(code: string, cases: CaseFields[], indications: IndicationFields[]): any {
        /**
         * example:
         * {
         *      disease: P1
         *      sample: 3
         *      indications: {
         *          G1: {
         *              positive: 0,
         *              negative: 0
         *          }
         *      }
         * }
        */
        return cases.reduce((accumulator, current) => {
            if (code === current.disease) {
                accumulator.sample++
                const indication = indications.reduce((acc, cur) => {
                    const positive = current.indications.some(indic => indic === cur.code)
                    const accPositive = acc[cur.code]?.positive || 0
                    const accNegative = acc[cur.code]?.negative || 0
                    acc[cur.code] = {
                        positive: positive ? accPositive + 1 : accPositive,
                        negative: !positive ? accNegative + 1 : accNegative
                    }
                    return acc
                }, {} as IndicationSample)

                console.log(indication)
            }
            return accumulator
        }, { disease: code, sample: 0, indication: {} } as Classification)
    }

    private getProbability(cases: CaseFields[], diseases: DiseaseFields[]): Probability {
        return diseases.reduce((acc, cur) => {
            const sample = diseases.length
            acc.totalCase = cases.length
            acc.prior[cur.code] = { sample, amount: sample / acc.totalCase }
            return acc
        }, { totalCase: 0, prior: {} } as Probability)
    }
}
