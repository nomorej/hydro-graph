import {
  GraphWithScale,
  GraphWithScaleParameters,
  SkipScaleSegmentParameters,
} from '../core/GraphWithScale'
import { linearGraph } from '../utils/graph'

export type WaterСonsumptionGraphsTypes = 'qh' | 'measured' | 'calculated'

export interface WaterСonsumptionParameters
  extends GraphWithScaleParameters<WaterСonsumptionGraphsTypes> {
  measuredColor?: string
  calculatedColor?: string
  qhColor?: string
}

export class WaterСonsumption extends GraphWithScale<WaterСonsumptionGraphsTypes> {
  public measuredColor: string
  public calculatedColor: string
  public qhColor: string

  constructor(parameters: WaterСonsumptionParameters) {
    super({
      scaleColor: 'black',
      ...parameters,
    })

    this.measuredColor = parameters.measuredColor || 'darkgreen'
    this.calculatedColor = parameters.calculatedColor || 'brown'
    this.qhColor = parameters.qhColor || 'green'
  }

  protected renderGraph() {
    const { renderer, scene } = this.complexGraph

    renderer.context.save()
    linearGraph(renderer.context, this.points.qh)
    renderer.context.strokeStyle = this.qhColor
    renderer.context.setLineDash([
      (scene.size.pointer.current / scene.zoom) * scene.zoom * 0.003,
      (scene.size.pointer.current / scene.zoom) * scene.zoom * 0.003,
    ])
    renderer.context.stroke()
    renderer.context.restore()

    linearGraph(renderer.context, this.points.calculated)
    renderer.context.strokeStyle = this.calculatedColor
    renderer.context.stroke()

    renderer.context.fillStyle = this.measuredColor
    this.points.measured.forEach((point) => {
      if (!this.complexGraph.calculator.isPointVisible(scene, point)) return
      renderer.context.beginPath()
      renderer.context.arc(point.x, point.y, renderer.minSize * 0.005, 0, Math.PI * 2)
      renderer.context.fill()
    })
  }

  protected skipScaleSegment(data: SkipScaleSegmentParameters): boolean {
    return data.index % 2 !== 0
  }
}
