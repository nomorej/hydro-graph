import { ComplexGraph } from '../core/ComplexGraph'
import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { SceneRenderData } from '../core/Scene'

export type AirTemperatureGraphsTypes = 'liquid' | 'solid'

export class Precipitation extends GraphWithScale<AirTemperatureGraphsTypes> {
  public liquidColor: string
  public solidColor: string

  constructor(parameters: GraphWithScaleParameters<AirTemperatureGraphsTypes>) {
    super(parameters)

    this.liquidColor = 'darkgreen'
    this.solidColor = 'darkblue'

    this.scaleColor = 'lightgreen'
    this.scaleSegmentColor = 'lightgreen'
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
