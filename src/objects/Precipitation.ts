import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'

export class Precipitation extends SceneRowObject {
  constructor() {
    super('precipitation', 1)
  }

  public render(data: SceneRenderData): void {}
}
