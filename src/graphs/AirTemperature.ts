import { LinearGraph, LinearGraphParameters } from '../core/LinearGraph'

export type AirTemperatureGraphsTypes = 'middle' | 'max' | 'min'

export interface AirTemperatureParameters extends LinearGraphParameters<AirTemperatureGraphsTypes> {
  minCurveColor?: string
  middleCurveColor?: string
  maxCurveColor?: string
}

export class AirTemperature extends LinearGraph<AirTemperatureGraphsTypes> {
  public minCurveColor: string
  public middleCurveColor: string
  public maxCurveColor: string

  constructor(parameters: AirTemperatureParameters) {
    super({
      scaleColor: '#B13007',
      gridColor: '#B13007',
      ...parameters,
    })

    this.minCurveColor = parameters.minCurveColor || '#0066FF'
    this.middleCurveColor = parameters.middleCurveColor || '#6B6C7E'
    this.maxCurveColor = parameters.maxCurveColor || '#D72929'
  }

  protected renderGraph() {
    if (this.visibility.min) {
      this.drawPoints(this.points.min, this.minCurveColor)
    }

    if (this.visibility.middle) {
      this.drawPoints(this.points.middle, this.middleCurveColor)
    }

    if (this.visibility.max) {
      this.drawPoints(this.points.max, this.maxCurveColor)
    }
  }
}
