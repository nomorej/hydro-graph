import { ComplexGraph } from '../core/ComplexGraph'
import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { SceneRenderData } from '../core/Scene'

export type PrecipitationGraphsTypes = 'liquid' | 'solid'

export interface PrecipitationParameters
  extends GraphWithScaleParameters<PrecipitationGraphsTypes> {
  liquidColor?: string
  solidColor?: string
}

export class Precipitation extends GraphWithScale<PrecipitationGraphsTypes> {
  public liquidColor: string
  public solidColor: string

  constructor(parameters: PrecipitationParameters) {
    super({
      scaleColor: 'lightgreen',
      gridColor: 'lightgreen',
      ...parameters,
    })

    this.liquidColor = parameters.liquidColor || 'darkgreen'
    this.solidColor = parameters.liquidColor || 'darkblue'
  }

  public renderGraph({ renderer }: SceneRenderData) {
    this.everyPoint((key, point) => {
      renderer.context.beginPath()
      renderer.context.fillStyle = key === 'solid' ? this.solidColor : this.liquidColor

      if (point.parent && !ComplexGraph.globals.calculator.isHoursZoom) {
        renderer.context.fillRect(
          point.parent.x,
          point.parent.y,
          point.parent.width,
          point.parent.height
        )
      } else {
        renderer.context.fillRect(point.x, point.y, point.width, point.height)
      }
    })
  }

  protected skipScaleSegment(data: SkipScaleSegmentParameters): boolean {
    return data.index % 2 !== 0
  }
}
