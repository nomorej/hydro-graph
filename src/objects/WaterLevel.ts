import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'

export class WaterLevel extends SceneRowObject {
  constructor() {
    super('waterTemperature', 4)
  }

  public render(_: SceneRenderData): void {}
}
