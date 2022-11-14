import { LinearGraph, LinearGraphParameters } from '../core/LinearGraph'

export type WaterLevelGraphsTypes = 'default'

export interface WaterLevelParameters extends LinearGraphParameters<WaterLevelGraphsTypes> {
  color?: string
}

export class WaterLevel extends LinearGraph<WaterLevelGraphsTypes> {
  private color: string

  constructor(parameters: WaterLevelParameters) {
    super({
      scaleColor: 'black',
      gridColor: 'black',
      ...parameters,
    })

    this.color = parameters.color || '#0066FF'
  }

  protected renderGraph() {
    if (this.visibility.default) {
      this.drawPoints(this.points.default, this.color)
    }
  }
}
