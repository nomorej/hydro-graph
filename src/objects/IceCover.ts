import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'

export class IceCover extends SceneRowObject {
  constructor() {
    super('ice-cover', 2)
  }

  public render(data: SceneRenderData): void {}
}
