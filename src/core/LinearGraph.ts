import { GraphPoint } from './Graph'
import { GraphWithScale, GraphWithScaleParameters } from './GraphWithScale'

export interface LinearGraphParameters<T extends string = 'default', EK extends string = T>
  extends GraphWithScaleParameters<T, EK> {}

export abstract class LinearGraph<
  K extends string = 'default',
  EK extends string = K
> extends GraphWithScale<K, EK> {
  constructor(parameters: LinearGraphParameters<K, EK>) {
    super(parameters)
  }

  protected drawPoints(points: GraphPoint[], color: string) {
    const { renderer } = this.complexGraph
    this.drawLinear(points)
    renderer.context.strokeStyle = color
    renderer.context.stroke()
  }

  protected drawLinear(points: Array<GraphPoint>) {
    if (!points.length) return

    const { renderer } = this.complexGraph
    const { context } = renderer

    context.beginPath()

    const sx = points[0].x
    const sy = points[0].y

    context.moveTo(sx, sy)

    for (let i = 1; i < points.length; i++) {
      const x = points[i].x
      const y = points[i].y

      if (points[i].new) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    }
  }
}
