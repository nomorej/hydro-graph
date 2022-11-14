import { LinearGraph, LinearGraphParameters } from '../core/LinearGraph'

export type SnowLevelGraphsTypes = 'default'

export interface SnowLevelParameters extends LinearGraphParameters<SnowLevelGraphsTypes> {
  color?: string
}

export class SnowLevel extends LinearGraph<SnowLevelGraphsTypes> {
  public color: string

  constructor(parameters: SnowLevelParameters) {
    super({
      scaleColor: '#0635DB',
      scalePosition: 'right',
      ...parameters,
    })

    this.color = parameters.color || '#0635DB'
  }

  protected renderGraph() {
    if (this.visibility.default) {
      this.drawPoints(this.points.default, this.color)
    }
  }
}
