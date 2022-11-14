import { LinearGraph, LinearGraphParameters } from '../core/LinearGraph'

export type WaterTemperatureGraphsTypes = 'default'

export interface WaterTemperatureParameters
  extends LinearGraphParameters<WaterTemperatureGraphsTypes> {
  color?: string
}

export class WaterTemperature extends LinearGraph<WaterTemperatureGraphsTypes> {
  public color: string

  constructor(parameters: WaterTemperatureParameters) {
    super({
      scaleColor: '#B13007',
      ...parameters,
    })
    this.color = parameters.color || '#EF543F'
  }

  protected renderGraph() {
    if (this.visibility.default) {
      this.drawPoints(this.points.default, this.color)
    }
  }
}
