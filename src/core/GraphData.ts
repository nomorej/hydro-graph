import { UtilsMonth } from '../utils/UtilsMonth'
import { DayData, KeyedMonthsData, MonthData, MonthsData } from '../utils/UtilsTS'

export interface GraphDataScaleSegment {
  position: number
  value: number
  isBase: boolean
}

export interface GraphDataScale {
  title?: string
  step: number
  segments: Array<GraphDataScaleSegment>
}

export interface GraphDataParameters<T extends KeyedMonthsData> {
  graph: T
  title?: string
  scale?: {
    title?: string
    process?: (segment: GraphDataScaleSegment) => void
    step?: number
  }
}

export class GraphData<T extends KeyedMonthsData> {
  public graph: T
  public graphNormalized: T
  public title?: string
  public scale?: GraphDataScale | undefined
  public min: number
  public max: number

  constructor(parameters: GraphDataParameters<T>) {
    this.graph = parameters.graph
    this.graphNormalized = {} as T
    this.title = parameters.title
    this.scale = parameters.scale
      ? {
          title: parameters.scale.title,
          step: parameters.scale.step || 10,
          segments: [],
        }
      : undefined

    this.min = 0
    this.max = 0

    if (Array.isArray(this.graph)) {
      this.min = UtilsMonth.minMonthsValue(this.graph)
      this.max = UtilsMonth.maxMonthsValue(this.graph)
    } else {
      Object.entries(this.graph).forEach(([_, graph]) => {
        let typeMin = UtilsMonth.minMonthsValue(graph)
        let typeMax = UtilsMonth.maxMonthsValue(graph)
        this.min = typeMin < this.min ? typeMin : this.min
        this.max = typeMax > this.max ? typeMax : this.max
      })
    }

    if (this.scale) {
      this.min = Math.floor(this.min / this.scale.step) * this.scale.step
      this.max = Math.ceil(this.max / this.scale.step) * this.scale.step

      const delta = this.max - this.min
      const segmentsData = []

      for (let i = 0; i <= delta / this.scale.step; i++) {
        segmentsData[i] = this.min + i * this.scale.step
      }

      segmentsData.forEach((t, i) => {
        const value = t
        this.scale!.segments[i] = {
          position: 0,
          value,
          isBase: true,
        }
        parameters.scale!.process?.(this.scale!.segments[i])
      })
    }

    const absMin = this.min < 0 ? Math.abs(this.min) : this.min

    this.everyKeyedValue(this.graph, ({ day }) => {
      day.number -= 1
    })

    this.everyKeyedValue(this.graph, ({ key, monthIndex, day, dayIndex }) => {
      if (!this.graphNormalized[key]) {
        this.graphNormalized[key] = [] as any
      }
      if (!this.graphNormalized[key][monthIndex]) {
        this.graphNormalized[key][monthIndex] = [] as any
      }
      this.graphNormalized[key][monthIndex][dayIndex] = { ...day }
      this.graphNormalized[key][monthIndex][dayIndex].value =
        (absMin + day.value) / (this.max + absMin)
    })
  }

  public everyKeyedValue(
    data: KeyedMonthsData,
    callback: (data: {
      key: keyof T
      month: MonthData
      monthIndex: number
      day: DayData
      dayIndex: number
    }) => number | void
  ) {
    for (const key in data) {
      const months = data[key]

      months.forEach((month, monthIndex) => {
        month.forEach((day, dayIndex) => {
          callback({ key, month, monthIndex, day, dayIndex })
        })
      })
    }
  }

  public everyMonth(
    data: MonthsData,
    callback: (data: {
      month: MonthData
      monthIndex: number
      day: DayData
      dayIndex: number
    }) => number | void
  ) {
    data.forEach((month, monthIndex) => {
      month.forEach((day, dayIndex) => {
        callback({ month, monthIndex, day, dayIndex })
      })
    })
  }
}
