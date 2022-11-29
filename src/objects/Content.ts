import { Object } from '../core/Object'

export interface ContentParameters {
  backgroundColor?: '#f5fcff'
}

export class Content extends Object {
  private readonly backgroundColor: string

  constructor(parameters?: ContentParameters) {
    super()

    this.backgroundColor = parameters?.backgroundColor || '#f5fcff'
  }

  public onRender() {
    const { renderer } = this.complexGraph
    renderer.context.fillStyle = this.backgroundColor
    renderer.context.fillRect(
      this.complexGraph.calculator.clipArea.x1,
      this.complexGraph.calculator.clipArea.y1,
      this.complexGraph.calculator.clipArea.width,
      this.complexGraph.calculator.clipArea.height
    )
  }
}
