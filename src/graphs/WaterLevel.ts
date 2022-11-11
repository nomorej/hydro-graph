import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { SceneRenderData } from '../core/Scene'
import { smoothGraph } from '../utils/graph'

export type WaterLevelGraphsTypes = 'default'

export interface WaterLevelParameters extends GraphWithScaleParameters<WaterLevelGraphsTypes> {
  color?: string
}

export class WaterLevel extends GraphWithScale<WaterLevelGraphsTypes> {
  private color: string

  constructor(parameters: WaterLevelParameters) {
    super({
      scaleColor: 'black',
      gridColor: 'black',
      ...parameters,
    })

    this.color = parameters.color || 'darkblue'
  }

  public renderGraph({ renderer }: SceneRenderData) {
    smoothGraph(renderer.context, this.points.default)
    renderer.context.strokeStyle = this.color
    renderer.context.stroke()
  }

  protected skipScaleSegment(data: SkipScaleSegmentParameters): boolean {
    return data.index % 2 !== 0
  }
}
