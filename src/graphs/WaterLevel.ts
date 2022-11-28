import { Graph } from '../core/Graph'
import { PointsParameters } from '../core/Points'

export interface WaterLevelParameters extends PointsParameters {
  adverseEventValue?: number
  adverseEventColor?: string
  dangerousEventValue?: number
  dangerousEventColor?: string
}

export class WaterLevel extends Graph {
  public readonly adverseEventValue?: number
  public readonly adverseEventColor: string

  public readonly dangerousEventValue?: number
  public readonly dangerousEventColor: string

  private adverseEventPosition?: number
  private dangerousEventPosition?: number

  constructor(parameters: WaterLevelParameters) {
    super(parameters)

    this.adverseEventValue = parameters.adverseEventValue
    this.adverseEventPosition = undefined
    this.adverseEventColor = parameters.adverseEventColor || 'orange'
    this.dangerousEventValue = parameters.dangerousEventValue
    this.dangerousEventPosition = undefined
    this.dangerousEventColor = parameters.dangerousEventColor || 'red'
  }

  protected override resizeElements(heightStep: number) {
    super.resizeElements(heightStep)

    if (this.adverseEventValue) {
      this.adverseEventPosition = heightStep * (this.adverseEventValue - this.min)
    }

    if (this.dangerousEventValue) {
      this.dangerousEventPosition = heightStep * (this.dangerousEventValue - this.min)
    }
  }

  protected override renderWithClip() {
    this.drawGroup('default')

    const { renderer } = this.complexGraph

    renderer.context.lineWidth = (renderer.minSize * 0.002) / this.complexGraph.renderer.pixelRatio

    if (this.adverseEventPosition) {
      renderer.context.beginPath()
      renderer.context.strokeStyle = this.adverseEventColor
      renderer.context.moveTo(this.row.x1, this.row.y2 - this.adverseEventPosition)
      renderer.context.lineTo(this.row.x2, this.row.y2 - this.adverseEventPosition)
      renderer.context.stroke()
    }

    if (this.dangerousEventPosition) {
      renderer.context.beginPath()
      renderer.context.strokeStyle = this.dangerousEventColor
      renderer.context.moveTo(this.row.x1, this.row.y2 - this.dangerousEventPosition)
      renderer.context.lineTo(this.row.x2, this.row.y2 - this.dangerousEventPosition)
      renderer.context.stroke()
    }
  }
}
