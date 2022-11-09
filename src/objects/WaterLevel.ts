// @ts-nocheck

import { SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'

export class WaterLevel extends Graph {
  constructor() {
    super('waterLevel', 4)
  }

  public render(_: SceneRenderData): void {}
}
