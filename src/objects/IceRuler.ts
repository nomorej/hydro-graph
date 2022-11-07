import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'

export class IceRuler extends SceneDataRepresentation {
  constructor() {
    super('iceRuler', 3)
  }

  public render(_: SceneRenderData): void {}
}
