import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'

export class SnowAmount extends SceneDataRepresentation {
  constructor() {
    super('snowAmount', 2)
  }

  public render(_: SceneRenderData): void {}
}
