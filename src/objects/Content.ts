import { ComplexGraph } from '../core/ComplexGraph'
import { Object } from '../core/Object'
import { SceneRenderData } from '../core/Scene'

export interface ContentParameters {
  backgroundColor?: '#f5fcff'
}

export class Content extends Object {
  public backgroundColor: string

  constructor(parameters?: ContentParameters) {
    super()

    this.backgroundColor = parameters?.backgroundColor || '#f5fcff'
  }

  public render({ renderer }: SceneRenderData) {
    renderer.context.fillStyle = this.backgroundColor
    renderer.context.fillRect(
      ComplexGraph.globals.calculator.clipArea.x1,
      ComplexGraph.globals.calculator.clipArea.y1,
      ComplexGraph.globals.calculator.clipArea.width,
      ComplexGraph.globals.calculator.clipArea.height
    )
  }
}
