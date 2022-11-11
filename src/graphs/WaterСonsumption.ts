import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { SceneRenderData } from '../core/Scene'
import { smoothGraph } from '../utils/graph'

export type WaterСonsumptionGraphsTypes = 'qh' | 'measured'

export interface WaterСonsumptionParameters
  extends GraphWithScaleParameters<WaterСonsumptionGraphsTypes> {
  color?: string
}

export class WaterСonsumption extends GraphWithScale<WaterСonsumptionGraphsTypes> {
  private color: string

  constructor(parameters: WaterСonsumptionParameters) {
    super({
      scaleColor: 'black',
      ...parameters,
    })

    this.color = parameters.color || 'darkgreen'
  }

  public renderGraph({ renderer, scene }: SceneRenderData) {
    smoothGraph(renderer.context, this.points.qh)
    renderer.context.strokeStyle = this.color
    renderer.context.setLineDash([
      (scene.size.pointer.current / scene.zoom) * scene.zoom * 0.003,
      (scene.size.pointer.current / scene.zoom) * scene.zoom * 0.003,
    ])
    renderer.context.stroke()

    renderer.context.fillStyle = this.color
    this.points.measured.forEach((p) => {
      renderer.context.beginPath()
      renderer.context.arc(p.x, p.y, renderer.minSize * 0.005, 0, Math.PI * 2)
      renderer.context.fill()
    })
  }

  protected skipScaleSegment(data: SkipScaleSegmentParameters): boolean {
    return data.index % 2 !== 0
  }
}
