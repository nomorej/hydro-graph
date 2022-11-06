import { CGGlobals } from '../core/ComplexGraph'
import { SceneRenderData } from '../core/Scene'
import { SceneRowObject } from '../core/SceneRowObject'
import UtilsShapes from '../utils/UtilsShapes'

export class AirTemperatureScale extends SceneRowObject {
  constructor() {
    super('airTemperature', 0)
  }

  public render({ renderer }: SceneRenderData): void {
    const {
      rowsPrimitives,
      scaleOffset,
      contentWrapper,
      scaleMarkSize,
      fontSize,
      scalePointerSize,
    } = CGGlobals.calculations

    UtilsShapes.yScale(renderer.context, {
      x: contentWrapper.x1 - scaleOffset,
      y: contentWrapper.y1,
      height: rowsPrimitives[this.row].height,
      marks: [10, 20, 30],
      dashSize: scaleMarkSize,
      fontSize,
      pointerSize: scalePointerSize,
    })
  }
}
