import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { linearGraph } from '../utils/graph'

export type SnowLevelGraphsTypes = 'default'

export interface SnowLevelParameters extends GraphWithScaleParameters<SnowLevelGraphsTypes> {
  color?: string
}

export class SnowLevel extends GraphWithScale<SnowLevelGraphsTypes> {
  public color: string

  constructor(parameters: SnowLevelParameters) {
    super({
      scaleColor: 'lightblue',
      scalePosition: 'right',
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
