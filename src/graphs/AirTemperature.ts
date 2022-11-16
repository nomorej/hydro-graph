import { Graph } from '../core/Graph'
import { PointsParameters } from '../core/Points'

export type AirTemperatureGroupsNames = 'middle' | 'max' | 'min' | 'post'

export class AirTemperature extends Graph<AirTemperatureGroupsNames> {
  constructor(parameters: PointsParameters<AirTemperatureGroupsNames>) {
    super(parameters)
  }

  protected override renderWithClip() {
    this.drawGroup('min')
    this.drawGroup('middle')
    this.drawGroup('max')
    this.drawGroup('post')
  }
}
