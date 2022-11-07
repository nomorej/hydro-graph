import { CGGlobals, DataRepsWithScales } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneDataRepresentation } from '../core/SceneDataRepresentation'
import UtilsShapes from '../utils/UtilsShapes'

export class AirTemperatureScale extends SceneDataRepresentation {
  constructor() {
    super('airTemperature', 0)
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
      scaleName: data.reps.airTemperature.scaleName,
      graphName: this.name! as DataRepsWithScales,
    })
  }
}
