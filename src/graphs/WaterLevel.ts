import { Graph } from '../core/Graph'
import { PointsParameters } from '../core/Points'

export class WaterLevel extends Graph {
  constructor(parameters: PointsParameters) {
    super(parameters)
  }

  protected override renderWithClip() {
    this.drawGroup('default')
  }
}
