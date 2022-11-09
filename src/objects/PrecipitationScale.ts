import { SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'
import UtilsShapes from '../utils/UtilsShapes'

export class PrecipitationScale extends Graph {
  constructor() {
    super('precipitation', 1)
  }

  public render({ renderer }: SceneRenderData) {
    UtilsShapes.yScale(renderer.context, {
      align: 'left',
      row: this.row,
      graphName: this.name!,
    })
  }
}
