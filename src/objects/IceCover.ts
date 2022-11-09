// @ts-nocheck

import { SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'

export class IceCover extends Graph {
  constructor() {
    super('iceCover', 2)
  }

  public render(_: SceneRenderData): void {}
}
