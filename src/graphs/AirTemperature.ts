import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { SceneRenderData } from '../core/Scene'
import { smoothGraph } from '../utils/graph'

export type AirTemperatureGraphsTypes = 'default'

export interface AirTemperatureParameters
  extends GraphWithScaleParameters<AirTemperatureGraphsTypes> {}

export class AirTemperature extends GraphWithScale<AirTemperatureGraphsTypes> {
  constructor(parameters: AirTemperatureParameters) {
    super({
      scaleColor: 'tomato',
      gridColor: 'tomato',
      ...parameters,
    })
  }

  public renderGraph({ renderer }: SceneRenderData) {
    smoothGraph(renderer.context, this.points.default)
    renderer.context.strokeStyle = 'darkred'
    renderer.context.stroke()
  }

  protected skipScaleSegment(data: SkipScaleSegmentParameters): boolean {
    return data.index % 2 !== 0
  }
}
