import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'

export class SnowAmount extends SceneRowObject {
  constructor() {
    super('snow-amount', 2)
  }

  public render(_: SceneRenderData): void {}
}
