import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'

export default class WaterTemperature extends SceneRowObject {
  constructor() {
    super('water-temperature', 2)
  }

  public render(_: SceneRenderData): void {}
}
