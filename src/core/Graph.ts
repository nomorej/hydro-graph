import { Object, ObjectParameters } from './Object'
import { Primitive } from './Primitive'
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
  rowFactor?: number
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

export type GraphVisibility<K extends string = 'default'> = { [key in K]: boolean }

export abstract class Graph<K extends string = 'default'> extends Object {
  public readonly rowParameter: number
  public readonly rowFactorParameter: number
  private dataParameter: GraphParameters<K>['data']
  protected row: Primitive = null!
  protected data: GraphData<K> = null!
  protected points: GraphPoints<K> = null!
  protected min: number = null!
  protected max: number = null!
  protected readonly visibility: GraphVisibility<K>

  constructor(parameters: GraphParameters<K>) {
    super(parameters)

    this.rowParameter = parameters.row
    this.rowFactorParameter = parameters.rowFactor || 1
    this.dataParameter = parameters.data

    this.visibility = {} as GraphVisibility<K>

    for (const key in this.dataParameter) {
      this.visibility[key] = true
    }
  }

  public recreate(data: GraphParameters<K>['data']) {
    this.dataParameter = data
    this.onDestroy?.()
    this.onCreate()
  }

  public override onCreate() {
    this.row = this.complexGraph.rows.rows[this.rowParameter!]

    const data: GraphData<K> = {} as GraphData<K>

    for (const key in this.dataParameter!) {
      const months = this.dataParameter![key]

      data[key] = []

      let index = 0

      months.forEach((month, monthIndex) => {
        month.forEach((day) => {
          if (typeof day.value !== 'number') {
            const daySegment = this.complexGraph.timeline.months[monthIndex].days[day.day - 1]

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
              segment: this.complexGraph.timeline.months[monthIndex].days[day.day - 1],
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

  public onRender() {
    const heightStep = this.row.height / Math.max(1, this.max - this.min)

    this.everyPoint((key, point, i) => {
      const item = this.data[key][i]
      point.width = item.segment.width
      point.height = heightStep * (+item.value - this.min)
      point.x = this.complexGraph.calculator.area.x1 + item.segment.x1
      point.y = this.row.y2 - point.height

      if (item.parent && point.parent) {
        point.parent.width = item.parent.segment.width
        point.parent.height = heightStep * (+item.parent.middleValue - this.min)
        point.parent.x = this.complexGraph.calculator.area.x1 + item.parent.segment.x1
        point.parent.y = this.row.y2 - point.parent.height
      }
    })

    this.complexGraph.calculator.clip(this.complexGraph.renderer, () => {
      this.renderGraph()
    })
  }

  public show(key?: K) {
    if (key) {
      this.visibility[key] = true
      this.complexGraph.renderer.redraw()
    } else {
      this.complexGraph.show(this)
    }
  }

  public hide(key?: K) {
    if (key) {
      this.visibility[key] = false
      this.complexGraph.renderer.redraw()
    } else {
      this.complexGraph.hide(this)
    }
  }

  protected abstract renderGraph(): void

  protected everyPoint(
    callback: (key: K, point: GraphPoint, index: number, points: Array<GraphPoint>) => void,
    points = this.points
  ) {
    for (const key in this.data) {
      points[key].forEach((point, i, arr) => {
        callback(key, point, i, arr)
      })
    }
  }
}
