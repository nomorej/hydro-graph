import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'

export class IceRuler extends SceneRowObject {
  constructor() {
    super('ice-ruler', 3)
  }

  public render(data: SceneRenderData): void {}
}
