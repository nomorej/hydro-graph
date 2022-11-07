import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'

export default class WaterTemperature extends SceneDataRepresentation {
  constructor() {
    super('waterTemperature', 2)
  }

  public render(_: SceneRenderData): void {}
}
