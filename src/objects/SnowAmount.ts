// @ts-nocheck

import { SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'

export class SnowAmount extends Graph {
  constructor() {
    super('snowAmount', 2)
  }

  public render(_: SceneRenderData): void {}
}
