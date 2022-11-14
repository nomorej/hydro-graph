import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { linearGraph } from '../utils/graph'

export type WaterTemperatureGraphsTypes = 'default'

export interface WaterTemperatureParameters
  extends GraphWithScaleParameters<WaterTemperatureGraphsTypes> {
  color?: string
}

export class WaterTemperature extends GraphWithScale<WaterTemperatureGraphsTypes> {
  public color: string

  constructor(parameters: WaterTemperatureParameters) {
    super({
      scaleColor: 'darkred',
      ...parameters,
    })

    this.color = parameters.color || 'darkred'
  }

  protected renderGraph() {
    const { renderer } = this.complexGraph

    linearGraph(renderer.context, this.points.default)
    renderer.context.strokeStyle = this.color
    renderer.context.stroke()
  }

  protected skipScaleSegment(data: SkipScaleSegmentParameters): boolean {
    return data.index % 2 !== 0
  }
}
