import { LinearGraph, LinearGraphParameters } from '../core/LinearGraph'

export type WaterСonsumptionGraphsTypes = 'qh' | 'measured' | 'calculated'

export interface WaterСonsumptionParameters
  extends LinearGraphParameters<WaterСonsumptionGraphsTypes> {
  measuredColor?: string
  calculatedColor?: string
  qhColor?: string
}

export class WaterСonsumption extends LinearGraph<WaterСonsumptionGraphsTypes> {
  public measuredColor: string
  public calculatedColor: string
  public qhColor: string

  constructor(parameters: WaterСonsumptionParameters) {
    super({
      scaleColor: 'black',
      ...parameters,
    })

    this.measuredColor = parameters.measuredColor || '#863688'
    this.calculatedColor = parameters.calculatedColor || 'brown'
    this.qhColor = parameters.qhColor || '#397634'
  }

  protected renderGraph() {
    const { renderer, calculator } = this.complexGraph

    if (this.visibility.qh) {
      renderer.context.save()
      renderer.context.setLineDash([calculator.clipArea.width * 0.01])
      this.drawPoints(this.points.qh, this.qhColor)
      renderer.context.restore()
    }

    if (this.visibility.calculated) {
      this.drawPoints(this.points.calculated, this.calculatedColor)
    }

    if (this.visibility.measured) {
      renderer.context.fillStyle = this.measuredColor
      this.points.measured.forEach((point) => {
        if (!this.complexGraph.calculator.isPointVisible(point)) return
        renderer.context.beginPath()
        renderer.context.arc(point.x, point.y, renderer.minSize * 0.005, 0, Math.PI * 2)
        renderer.context.fill()
      })
    }
  }
}
