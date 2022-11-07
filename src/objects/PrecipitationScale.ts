import { CGGlobals, DataRepsWithScales } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'
import UtilsShapes from '../utils/UtilsShapes'

export class PrecipitationScale extends SceneDataRepresentation {
  constructor() {
    super('precipitation', 1)
  }

  public render({ renderer }: SceneRenderData) {
    const { calculations, colors, data, font } = CGGlobals

    UtilsShapes.yScale(renderer.context, {
      align: 'left',
      calculations,
      colors,
      data,
      font,
      row: this.row,
      scaleName: data.reps.precipitation.scaleName,
      graphName: this.name! as DataRepsWithScales,
    })
  }
}
