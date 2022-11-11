import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { SceneRenderData } from '../core/Scene'

export type AirTemperatureGraphsTypes = 'default'

export class AirTemperature extends GraphWithScale<AirTemperatureGraphsTypes> {
  constructor(parameters: GraphWithScaleParameters<AirTemperatureGraphsTypes>) {
    super(parameters)

    this.scaleColor = 'tomato'
    this.scaleSegmentColor = 'tomato'
  }

  public renderGraph({ renderer }: SceneRenderData) {
    this.smooth(renderer, () => {
      renderer.context.strokeStyle = 'darkred'
      renderer.context.stroke()
    })
  }

  protected skipScaleSegment(data: SkipScaleSegmentParameters): boolean {
    return data.index % 2 !== 0
  }
}
