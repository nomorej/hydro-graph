import { ComplexGraph } from '../core/ComplexGraph'
import { Object } from '../core/Object'
import { SceneRenderData } from '../core/Scene'

export class Content extends Object {
  constructor() {
    super()
  }

  public render({ renderer }: SceneRenderData) {
    renderer.context.fillStyle = ComplexGraph.globals.colors.content.background
    renderer.context.fillRect(
      ComplexGraph.globals.calculator.clipArea.x1,
      ComplexGraph.globals.calculator.clipArea.y1,
      ComplexGraph.globals.calculator.clipArea.width,
      ComplexGraph.globals.calculator.clipArea.height
    )
  }
}
