import { SceneRenderData } from '../core/Scene'
import { Graph } from '../core/Graph'
import UtilsShapes from '../utils/UtilsShapes'

export class AirTemperatureScale extends Graph {
  constructor() {
    super('airTemperature', 0)
  }

  public render({ renderer }: SceneRenderData) {
    UtilsShapes.yScale(renderer.context, {
      align: 'left',
      row: this.row,
      graphName: this.name!,
    })
  }
}
