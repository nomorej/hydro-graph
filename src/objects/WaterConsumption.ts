import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'

export class WaterConsumption extends SceneDataRepresentation {
  constructor() {
    super('waterConsumption', 4)
  }

  public render(_: SceneRenderData): void {}
}
