// @ts-nocheck

import { SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'

export class IceRuler extends Graph {
  constructor() {
    super('iceRuler', 3)
  }

  public render(_: SceneRenderData): void {}
}
