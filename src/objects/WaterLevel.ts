import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'

export class WaterLevel extends SceneDataRepresentation {
  constructor() {
    super('waterLevel', 4)
  }

  public render(_: SceneRenderData): void {}
}
