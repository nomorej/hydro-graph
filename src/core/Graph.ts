import { ComplexGraph } from './ComplexGraph'
import { Object, ObjectParameters } from './Object'
import { Row } from './Rows'
import { SceneRenderData } from './Scene'
import { TimelineSegment } from './Timeline'

export interface GraphDataPoint {
  segment: TimelineSegment
  value: number
  parent?: {
    segment: TimelineSegment
    middleValue: number
  }
}

export type GraphTimelineData<T = GraphDataPoint> = Array<T>

export type GraphData<K extends string = 'default', T = GraphDataPoint> = {
  [KEY in K]: GraphTimelineData<T>
}

export interface GraphParameters<K extends string = 'default'> extends ObjectParameters {
  row: number
  data: GraphData<K, Array<{ day: number; value: number | Array<{ hour: number; value: number }> }>>
}

export interface GraphPoint {
  x: number
  y: number
  width: number
  height: number
  parent?: GraphPoint
}

export type GraphPoints<K extends string = 'default'> = { [KEY in K]: Array<GraphPoint> }

export abstract class Graph<K extends string = 'default'> extends Object {
  protected readonly row: Row
  protected readonly data: GraphData<K>
  protected readonly points: GraphPoints<K>
  protected min: number
  protected max: number

  constructor(parameters: GraphParameters<K>) {
    super(parameters)

    this.row = ComplexGraph.globals.rows.rows[parameters.row]

    const data: GraphData<K> = {} as GraphData<K>

    for (const key in parameters.data) {
      const months = parameters.data[key]

      data[key] = []

      let index = 0

      months.forEach((month, monthIndex) => {
        month.forEach((day) => {
          if (typeof day.value !== 'number') {
            const daySegment = ComplexGraph.globals.timeline.months[monthIndex].days[day.day - 1]

            const parent = {
              segment: daySegment,
              middleValue: 0,
            }

            day.value.forEach((hour, _index, arr) => {
              data[key][index] = {
                segment: daySegment.hours[hour.hour - 1],
                value: hour.value,
                parent: parent,
              }

              parent.middleValue = arr.reduce((p, c) => p + c.value, 0) / arr.length

              index++
            })
          } else {
            data[key][index] = {
              segment: ComplexGraph.globals.timeline.months[monthIndex].days[day.day - 1],
              value: day.value,
            }
            index++
          }
        })
      })
    }

    this.data = data
    this.points = {} as GraphPoints<K>

    this.min = 0
    this.max = -999999999

    for (const key in this.data) {
      this.points[key] = []

      this.data[key].forEach((item) => {
        this.min = item.value < this.min ? +item.value : this.min
        this.max = item.value > this.max ? +item.value : this.max

        const point: GraphPoint = { x: 0, y: 0, width: 0, height: 0 }

        if (item.parent) {
          point.parent = { x: 0, y: 0, width: 0, height: 0 }
        }

        this.points[key].push(point)
      })
    }
  }

  public render(data: SceneRenderData): void {
    const heightStep = this.row.primitive.height / Math.max(1, this.max - this.min)

    this.everyPoint((key, point, i) => {
      const item = this.data[key][i]
      console.log(item.value, this.min)
      point.width = item.segment.width
      point.height = heightStep * (+item.value - this.min)
      point.x = ComplexGraph.globals.calculator.area.x1 + item.segment.x1
      point.y = this.row.primitive.y2 - point.height

      if (item.parent && point.parent) {
        point.parent.width = item.parent.segment.width
        point.parent.height = heightStep * (+item.parent.middleValue - this.min)
        point.parent.x = ComplexGraph.globals.calculator.area.x1 + item.parent.segment.x1
        point.parent.y = this.row.primitive.y2 - point.parent.height
      }
    })

    ComplexGraph.globals.calculator.clip(data.renderer, () => {
      this.renderGraph(data)
    })
  }

  protected abstract renderGraph(data: SceneRenderData): void

  protected everyPoint(
    callback: (key: K, point: GraphPoint, index: number, points: Array<GraphPoint>) => void
  ) {
    for (const key in this.data) {
      this.points[key].forEach((point, i, arr) => {
        callback(key, point, i, arr)
      })
    }
  }
}
