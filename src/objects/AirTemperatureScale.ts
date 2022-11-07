import { CGGlobals } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'
import UtilsShapes from '../utils/UtilsShapes'

export class AirTemperatureScale extends SceneRowObject {
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
      name: data.airTemperature.scaleName,
    })
  }
}
