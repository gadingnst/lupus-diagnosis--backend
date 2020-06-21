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
    [disease: string]: IndicationSample
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

        const classification = this.classify(diseases, cases, indications);
        return classification
    }

    public async filterByDisease(disease: string): Promise<CaseFields[]> {
        const data = await this.all()
        return data.filter(
            (train: CaseFields) => train.disease === disease.toUpperCase().trim()
        )
    }

    /**
     * example result:
     * P1: {
     *  G1: {
     *    positive: 0.6
     *    negative: 0.3
     *  },
     *  ...
     * }
    */
    private classify(diseases: DiseaseFields[], cases: CaseFields[], indications: IndicationFields[]): any {
        return diseases.reduce((dAcc, dCur) => {
            const caseResult = cases.filter(({ disease }) => disease === dCur.code)
            const samplePerDisease = caseResult.length
            const indicationResult: IndicationSample = indications.reduce((iAcc, iCur) => {
                const totalFeature = caseResult.reduce((cAcc, cCur) => {
                    if (cCur.indications.includes(iCur.code)) cAcc.positive++
                    else cAcc.negative++
                    return cAcc
                }, { positive: 0, negative: 0 })
                const positive = totalFeature.positive / samplePerDisease
                const negative = totalFeature.negative / samplePerDisease
                return {
                    ...iAcc,
                    [iCur.code]: { positive, negative }
                }
            }, {} as IndicationSample)
            dAcc[dCur.code] = indicationResult
            return dAcc
        }, {} as Classification)
    }
}
