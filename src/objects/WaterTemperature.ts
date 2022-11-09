// @ts-nocheck

import { SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'

export default class WaterTemperature extends Graph {
  constructor() {
    super('waterTemperature', 2)
  }

  public render(_: SceneRenderData): void {}
}
