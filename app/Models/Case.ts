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

export interface Prediction {
    prediction: Classification
    classification: Classification[]
}

export interface Classification extends DiseaseFields {
    posterior: number
    percentage?: number
}

export default class Case extends Model<CaseFields> {
    protected primaryKey = 'id'
    protected prefixKey = ''
    protected uniqueKey = []
    private disease: Disease
    private indication: Indication

    constructor() {
        super('train.json')
        this.disease = new Disease()
        this.indication = new Indication()
    }

    public async predict(input: string[]): Promise<Prediction> {
        input = input.map(indication => indication.toUpperCase().trim())
        const [cases, diseases, indications] = await Promise.all([
            this.all(),
            this.disease.all(),
            this.indication.all()
        ])
        let prediction: Classification = {} as any
        const classification = this.classify(input, { cases, diseases, indications })
        const maxPosterior = Math.max(...classification.map(({ posterior }) => posterior))
        const totalPosterior = classification.reduce((accumulator, current) => {
            const { posterior } = current
            if (maxPosterior === posterior) prediction = current 
            return accumulator + posterior
        }, 0)
        return {
            prediction: {
                ...prediction,
                percentage: this.getPercentage(prediction?.posterior, totalPosterior)
            },
            classification: classification.map(data => ({
                ...data,
                percentage: this.getPercentage(data.posterior, totalPosterior)
            }))
        }
    }

    private classify(input: string[], { diseases, cases, indications }: ClassifyParams): Classification[] {
        const totalTrainCase = cases.length
        return diseases.reduce((accumulator, current) => {
            const filteredCases = cases.filter(({ disease }) => disease === current.code)
            const sample = filteredCases.length
            const prior = sample / totalTrainCase
            const posterior = this.getPosterior(input, { indications, prior, sample, filteredCases })
            return [...accumulator, { ...current, posterior }]
        }, [] as Classification[])
    }

    private getPosterior(input: string[], params: PosteriorParams): number {
        const { filteredCases, indications, prior, sample } = params
        const likelihood = indications.reduce((accumulator, { code }) => {
            const { positive, negative } = this.featuring(filteredCases, code, sample)
            const { value } = this.getProbability(input, { code, positive, negative })
            return accumulator * value
        }, 1)
        return likelihood * prior
    }

    private getProbability(input: string[], { code, positive, negative }: IndicationSample): Probability {
        return input.some(indication => code === indication)
            ? { code, value: positive }
            : { code, value: negative }
    }

    private featuring(filteredCases: CaseFields[], indicationCode: string, sample: number) {
        const totalFeature = filteredCases.reduce((accumulator, { indications }) => {
            if (indications.includes(indicationCode)) accumulator.positive++
            else accumulator.negative++
            return accumulator
        }, { positive: 0, negative: 0 })
        return {
            positive: totalFeature.positive / sample,
            negative: totalFeature.negative / sample
        }
    }

    private getPercentage(number: number | undefined = 0, total: number): number {
        const percent = (number / total) * 100
        return parseFloat(percent.toFixed(2))
    }

    public async filterByDisease(disease: string): Promise<CaseFields[]> {
        const data = await this.all()
        return data.filter(
            (train: CaseFields) => train.disease === disease.toUpperCase().trim()
        )
    }
}
