import { ComplexGraph } from './ComplexGraph'
import { Object, ObjectParameters } from './Object'
import { Renderer } from './Renderer'
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
  row: Row
  data: GraphData<K>
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

    this.row = parameters.row
    this.data = parameters.data
    this.points = {} as GraphPoints<K>

    this.min = 9999999999
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
    const heightStep = this.row.primitive.height / (this.max - this.min)

    this.everyPoint((key, point, i) => {
      const item = this.data[key][i]

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

  protected linear({ context }: Renderer, draw: (key: K) => void) {
    for (const key in this.points) {
      const points = this.points[key]

      const sx = points[0].x
      const sy = points[0].y

      context.beginPath()
      context.moveTo(sx, sy)

      for (let i = 1; i < points.length; i++) {
        const x = points[i].x
        const y = points[i].y

        context.lineTo(x, y)
      }

      draw(key)
    }
  }

  protected smooth({ context }: Renderer, draw: (key: K) => void) {
    for (const key in this.points) {
      const points = this.points[key]

      const sx = points[0].x
      const sy = points[0].y

      context.beginPath()
      context.moveTo(sx, sy)

      for (let i = 0; i < points.length - 1; i++) {
        const x1 = (points[i].x + points[i + 1].x) / 2
        const y1 = (points[i].y + points[i + 1].y) / 2

        const cx1 = (x1 + points[i].x) / 2
        const cy1 = points[i].y

        const x2 = points[i + 1].x
        const y2 = points[i + 1].y

        const cx2 = (x1 + points[i + 1].x) / 2
        const cy2 = points[i + 1].y

        context.quadraticCurveTo(cx1, cy1, x1, y1)
        context.quadraticCurveTo(cx2, cy2, x2, y2)
      }

      draw(key)
    }
  }
}
