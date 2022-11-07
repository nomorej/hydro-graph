import { CGGlobals } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'
import UtilsShapes from '../utils/UtilsShapes'

export class AirTemperatureScale extends SceneRowObject {
  constructor() {
    super('airTemperature', 0)
  }

  public render({ renderer }: SceneRenderData) {
    const { calculations, colors } = CGGlobals

    const { rowsPrimitives, scaleOffset, contentWrapper, fontSize, scaleThickness, scales } =
      calculations

    UtilsShapes.yScale(renderer.context, {
      x: contentWrapper.x1 - scaleOffset,
      y: contentWrapper.y1,
      height: rowsPrimitives[this.row].height,
      segments: scales.airTemperature,
      fontSize,
      lineColor: colors.airTemperature.scale,
      thickness: scaleThickness,
    })
  }
}
