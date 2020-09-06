import Model from './FSModel'
import Disease, { DiseaseFields } from './Disease'
import Indication, { IndicationFields } from './Indication'

export interface CaseFields {
    id?: string
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


    // fungsi prediksi
    public async predict(input: string[]): Promise<Prediction> {
        // memodifikasi input kode gejala yang dikirim kan ke huruf besar
        // agar sinkron dengan data yang disimpan di dalam database
        input = input.map(indication => indication.toUpperCase().trim())

        // memanggil data yang tersimpan didalam database
        // cases: data training
        // diseases: data penyakit
        // indications: data gejala
        const [cases, diseases, indications] = await Promise.all([
            this.all(),
            this.disease.all(),
            this.indication.all()
        ])
        
        // deklarasi variable untuk klasifikasi, diawali dengan objek kosong
        let prediction: Classification = {} as any

        // memanggil fungsi classify (ada dibawah) dengan mempassing input dan data yang sudah didapat dari database.
        const classification = this.classify(input, { cases, diseases, indications })
        
        // mencari nilai posterior yang tertinggi dari hasil klasifikasi
        // untuk mencari probabilitas penyakit yang tertinggi 
        const maxPosterior = Math.max(...classification.map(({ posterior }) => posterior))
        
        // menghitung seluruh nilai posterior dari berbagai klasifikasi untuk mendapatkan persentase
        const totalPosterior = classification.reduce((accumulator, current) => {
            const { posterior } = current
            
            // jika posterior yang di looping sama dengan posterior tertinggi yang sudah didapat di atas 
            // maka akan mengisi variable prediksi dengan data yang telah di kalkulasikan
            if (maxPosterior === posterior) prediction = current 
            
            return accumulator + posterior
        }, 0)
        
        // mengirim data ke client untuk (Android)
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

    // fungsi klasifikasi
    private classify(input: string[], { diseases, cases, indications }: ClassifyParams): Classification[] {
        // mendapatkan total kasus pada data training, untuk sekarang ada 10 data 
        const totalTrainCase = cases.length
        
        // memproses perulangan tiap data penyakit,
        // jika data penyakit ada 4, maka proses ini berjalan berulang secara 4x
        // current adalah variable yang berisi data penyakit, dari P1 - P4
        return diseases.reduce((accumulator, current) => {

            // memfilter sampel kasus yang ada pada data training dengan current kode penyakit
            // untuk saat ini, data training berjumlah 10, nah yang di ambil adalah data training yang terkait dengan
            // current kasus penyakit.
            const filteredCases = cases.filter(({ disease }) => disease === current.kode_penyakit)

            // mendapatkan total current kasus penyakit,
            // cth: ketika current adalah P1, maka nilai variable sample ini adalah 3
            const sample = filteredCases.length
            
            // mencari nilai prior (sample / total data training)
            // ketika current adalah P1, maka (prior = 3 / 10) dst.
            const prior = sample / totalTrainCase
            
            // mengkalkulasi nilai posterior untuk tiap data penyakit
            // dengan mempassing variable gejala, nilai prior, sample, dan kasus current penyakit.
            const posterior = this.getPosterior(input, { indications, prior, sample, filteredCases })
            
            // memberi klasifikasi tiap data penyakit dengan nilai posterior
            return [...accumulator, { ...current, posterior }]
        }, [] as Classification[])
    }

    // fungsi untuk mendapatkan nilai posterior
    private getPosterior(input: string[], params: PosteriorParams): number {
        const { filteredCases, indications, prior, sample } = params

        // mencari nilai likelihood dari tiap gejala berdasarkan data training.
        // jika data gejala yang ada di database ada 20,
        // berarti proses ini berulang sebanyak 20x
        const likelihood = indications.reduce((accumulator, { kode_gejala: code }) => {
            // fungsi featuring berguna untuk mendapatkan nilai dari pilihan 'Ya' atau 'Tidak'
            const { positive, negative } = this.featuring(filteredCases, code as string, sample)

            // mendapatkan nilai probabilitas dari nilai 'Ya' dan 'Tidak'
            // berdasarkan input data
            // cth:
            // P1 : Ya pada G1 untuk P1 = 2/3 = 0,6
            // P1 : Tidak pada G1 untuk P1 = 1/3 = 0,3
            // P1 : Ya pada G2 untuk P1 = 1/3 = 0,3
            // P1 : Tidak pada G2 untuk P1 = 2/3 = 0,6
            // dst sampai P4 dengan data G20
            const { value } = this.getProbability(input, {
                code: code as string,
                positive,
                negative
            })

            // mengakumulasi nilai probabilitas untuk menjadi nilai likelihood tiap data gejala
            // cth: P1 = 0,6*0,6*0,6*0,3*0,6*0,3*0,3*...dst = 0,xxxx
            return accumulator * value
        }, 1)

        // mengalikan likelihood dengan nilai prior
        // P1 = 0,xxxx * 0,xxx = 0,xxxx
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
