import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'

export class WaterConsumption extends SceneRowObject {
  constructor() {
    super('water-consumption', 4)
  }

  public render(_: SceneRenderData): void {}
}
