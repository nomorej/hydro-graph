import { ScaleSegment } from '../core/Scale'
import { Visualizer, VisualizerElement, VisualizerParameters } from '../core/Visualizer'
import { linearGraph } from '../utils/graph'

export type SnowIceValue = { snow: number; ice: number }

export interface SnowIceParameters extends VisualizerParameters<SnowIceValue> {
  snowFillColor?: string
  iceFillColor?: string
  snowStrokeColor?: string
  iceStrokeColor?: string
}

export class SnowIce extends Visualizer<SnowIceValue> {
  private scaleZeroSegment?: ScaleSegment

  private readonly snowFillColor: string
  private readonly iceFillColor: string
  private readonly snowStrokeColor: string
  private readonly iceStrokeColor: string
  private readonly sortedGroups: Array<Array<VisualizerElement<SnowIceValue>>>

  constructor(parameters: SnowIceParameters) {
    super(parameters)

    this.snowFillColor = parameters.snowFillColor || 'lightblue'
    this.iceFillColor = parameters.iceFillColor || 'blue'

    this.snowStrokeColor = parameters.snowStrokeColor || 'lightblue'
    this.iceStrokeColor = parameters.iceStrokeColor || 'blue'

    this.sortedGroups = [[]]
  }

  public override onCreate() {
    super.onCreate()
    this.scaleZeroSegment = this.scale?.segments.find((s) => s.value === 0)

    const elements = this.groups.get('default')!.elements

    let groupIndex = 0
    elements.forEach((el) => {
      if (el.new) {
        groupIndex++
        this.sortedGroups[groupIndex] = []
      }

      this.sortedGroups[groupIndex].push(el)
    })
  }

  protected override renderWithClip(heightStep: number) {
    this.groups.forEach((group) => {
      if (!group.isVisible || !group.elements.length) return

      this.fill(this.snowFillColor)
      this.stroke(this.snowStrokeColor)

      group.elements.forEach((element) => {
        element.height = heightStep * (Math.abs(element.value.ice) * -1 - this.min)
        element.y = this.row.y2 - element.height
      })

      this.fill(this.iceFillColor)
      this.stroke(this.iceStrokeColor)
    })
  }

  protected override calclulateMinMax() {
    this.groups.forEach((group) => {
      group.elements.forEach((element) => {
        const iceValue = Math.abs(element.value.ice) * -1
        this.min = iceValue < this.min ? iceValue : this.min
        this.max = element.value.snow > this.max ? element.value.snow : this.max
      })
    })
  }

  protected resizeElements(heightStep: number) {
    this.groups.forEach((group) => {
      if (!group.isVisible) return
      group.elements.forEach((element) => {
        element.width = element.endSegment.x1 - element.startSegment.x1
        element.height = heightStep * (element.value.snow - this.min)
        element.x = this.complexGraph.calculator.area.x1 + element.startSegment.x1
        element.y = this.row.y2 - element.height
      })
    })
  }

  private stroke(color: string) {
    const { renderer } = this.complexGraph

    renderer.context.strokeStyle = color
    linearGraph(renderer.context, this.groups.get('default')!.elements)
    renderer.context.stroke()
  }

  private fill(color: string) {
    const { renderer, calculator } = this.complexGraph

    this.sortedGroups.forEach((g) => {
      const fe = g[0]
      const le = g[g.length - 1]

      if (!calculator.isPointVisible(fe, (fe.x - le.x) * -1)) return

      renderer.context.fillStyle = color
      renderer.context.beginPath()
      renderer.context.moveTo(fe.x, this.scaleZeroSegment!.y)

      g.forEach((el) => {
        renderer.context.lineTo(el.x, el.y)
      })

      renderer.context.lineTo(le.x, this.scaleZeroSegment!.y)
      renderer.context.fillStyle = color
      renderer.context.fill()
    })
  }
}
