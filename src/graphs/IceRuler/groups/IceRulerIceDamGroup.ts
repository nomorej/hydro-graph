import { TimelineSegment } from '../../../core/Timeline'
import { clamp } from '../../../utils/math'
import { VisualizerElement } from '../../../visualizer/VisualizerElement'
import { IceRulerGroupParameters } from '../IceRulerGroup'
import { IceRulerTriangleGroup } from './IceRulerTriangleGroup'

type DamType = 'start' | 'end' | 'intermediate'

export abstract class IceRulerIceDamGroup extends IceRulerTriangleGroup {
  private mergedElements: Array<VisualizerElement<undefined>>

  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)

    this.mergedElements = []

    const chunks: Array<Array<VisualizerElement<undefined>>> = []

    let acc = 0

    for (let index = 0; index < this.elements.length; index++) {
      const el = this.elements[index]

      if (!chunks[acc]) {
        chunks[acc] = [el]
      }

      if (!this.elements[index - 1]) continue

      const itemPrev = this.elements[index - 1]
      const delta = el.startSegment.index - itemPrev.startSegment.index

      if (delta <= 24) {
        chunks[acc].push(el)
      } else {
        acc++
        chunks[acc] = [el]
      }
    }

    chunks.forEach((chunk, i) => {
      const el = chunk[0]
      el.endSegment = chunk[chunk.length - 1].startSegment.nextDaySegment

      this.mergedElements[i] = el
    })
  }

  public override resize() {
    super.resize()
  }

  public render() {
    const { complexGraph } = this.visualizer
    const { renderer, calculator } = complexGraph

    this.mergedElements.forEach((el) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return

      const s = clamp(calculator.area.width * 0.0011, 1, el.height) / 2

      const o1 = el.height - s
      const y = el.y + o1
      const offset = s * 3

      renderer.context.strokeStyle = this.color
      renderer.context.save()
      renderer.context.beginPath()
      renderer.context.setLineDash([10])
      renderer.context.moveTo(el.x + offset, y)
      renderer.context.lineTo(el.x + el.width - offset, y)
      renderer.context.stroke()
      renderer.context.restore()

      this.drawEdge(el.x + s, y, s)
      this.drawEdge(el.x + el.width - s, y, s)
    })
  }

  protected abstract drawEdge(x: number, y: number, s: number): void
}
