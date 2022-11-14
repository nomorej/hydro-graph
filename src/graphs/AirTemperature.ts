import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { linearGraph } from '../utils/graph'

export type AirTemperatureGraphsTypes = 'middle' | 'max' | 'min'

export interface AirTemperatureParameters
  extends GraphWithScaleParameters<AirTemperatureGraphsTypes> {
  minCurveColor?: string
  middleCurveColor?: string
  maxCurveColor?: string
}

export class AirTemperature extends GraphWithScale<AirTemperatureGraphsTypes> {
  public minCurveColor: string
  public middleCurveColor: string
  public maxCurveColor: string

  constructor(parameters: AirTemperatureParameters) {
    super({
      scaleColor: 'tomato',
      gridColor: 'tomato',
      ...parameters,
    })

    this.minCurveColor = parameters.minCurveColor || 'darkblue'
    this.middleCurveColor = parameters.middleCurveColor || 'darkgrey'
    this.maxCurveColor = parameters.maxCurveColor || 'darkred'
  }

  protected renderGraph() {
    const { renderer } = this.complexGraph

    if (this.visibility.min) {
      linearGraph(renderer.context, this.points.min)
      renderer.context.strokeStyle = this.minCurveColor
      renderer.context.stroke()
    }

    if (this.visibility.middle) {
      linearGraph(renderer.context, this.points.middle)
      renderer.context.strokeStyle = this.middleCurveColor
      renderer.context.stroke()
    }

    if (this.visibility.max) {
      linearGraph(renderer.context, this.points.max)
      renderer.context.strokeStyle = this.maxCurveColor
      renderer.context.stroke()
    }
  }

  protected skipScaleSegment(data: SkipScaleSegmentParameters): boolean {
    return data.index % 2 !== 0
  }
}
