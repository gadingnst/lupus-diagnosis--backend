import Model from './Model'
import Disease, { DiseaseFields } from './Disease'
import Indication, { IndicationFields } from './Indication'

export interface CaseFields {
    id: string
    disease: string
    indications: string[]
}

export interface IndicationSample {
    code: string
    positive: number
    negative: number
}

export interface Probability {
    code: string
    value: number
}

export interface Classification {
    disease: string
    posterior: number
}

export interface ClassifyParams {
    diseases: DiseaseFields[]
    cases: CaseFields[]
    indications: IndicationFields[]
}

export interface PosteriorParams {
    indications: IndicationFields[]
    filteredCases: CaseFields[]
    sample: number
    prior: number
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

        const classification = this.classify(input, { cases, diseases, indications })
        const maxPosterior = Math.max(...classification.map(({ posterior }) => posterior))
        console.log({ maxPosterior })
        return { classification }
    }

    public async filterByDisease(disease: string): Promise<CaseFields[]> {
        const data = await this.all()
        return data.filter(
            (train: CaseFields) => train.disease === disease.toUpperCase().trim()
        )
    }

    private classify(input: string[], { diseases, cases, indications }: ClassifyParams): Classification[] {
        const totalTrainCase = cases.length
        return diseases.reduce((acc, { code }) => {
            const filteredCases = cases.filter(({ disease }) => disease === code)
            const sample = filteredCases.length
            const prior = sample / totalTrainCase
            const posterior = this.getPosterior(input, { indications, prior, sample, filteredCases })
            acc.push({ disease: code, posterior })
            return acc
        }, [] as Classification[])
    }

    private getPosterior(input: string[], params: PosteriorParams): number {
        const { filteredCases, indications, prior, sample } = params
        const likelihood = indications.reduce((acc, { code }) => {
            const { positive, negative } = this.featuring(filteredCases, code, sample)
            const { value } = this.getProbability({ code, positive, negative }, input)
            acc *= value
            return acc
        }, 1)
        return likelihood * prior
    }

    private featuring(filteredCases: CaseFields[], indicationCode: string, sample: number) {
        const totalFeature = filteredCases.reduce((acc, { indications }) => {
            if (indications.includes(indicationCode)) acc.positive++
            else acc.negative++
            return acc
        }, { positive: 0, negative: 0 })
        return {
            positive: totalFeature.positive / sample,
            negative: totalFeature.negative / sample
        }
    }

    private getProbability({ code, positive, negative }: IndicationSample, input: string[]): Probability {
        return input.some(indication => code === indication)
            ? { code, value: positive }
            : { code, value: negative }
    }
}
