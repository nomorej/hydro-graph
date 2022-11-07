import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'

export class IceCover extends SceneDataRepresentation {
  constructor() {
    super('iceCover', 2)
  }

  public render(_: SceneRenderData): void {}
}
