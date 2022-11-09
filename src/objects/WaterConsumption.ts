// @ts-nocheck

import { SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'

export class WaterConsumption extends Graph {
  constructor() {
    super('waterConsumption', 4)
  }

  public render(_: SceneRenderData): void {}
}
