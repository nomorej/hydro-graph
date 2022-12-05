import { clamp } from '../../../utils/math'
import { VisualizerElement } from '../../../visualizer/VisualizerElement'
import { IceRulerGroupParameters } from '../IceRulerGroup'
import { IceRulerTriangleGroup } from './IceRulerTriangleGroup'

type DamType = 'start' | 'end' | 'intermediate'

export abstract class IceRulerIceDamGroup extends IceRulerTriangleGroup {
  private chunks: Array<Array<VisualizerElement<undefined>>>

  constructor(parameters: IceRulerGroupParameters) {
    super(parameters)

    this.chunks = []

    this.elements
    let acc = 0

    for (let index = 0; index < this.elements.length; index++) {
      const el = this.elements[index]

      if (!this.chunks[acc]) {
        this.chunks[acc] = [el]
      }

      if (!this.elements[index - 1]) continue

      const itemPrev = this.elements[index - 1]
      const delta = el.startSegment.index - itemPrev.startSegment.index

      if (delta === 23 || delta === 1) {
        this.chunks[acc].push(el)
      } else {
        acc++
        this.chunks[acc] = [el]
      }
    }
  }

  public render() {
    this.chunks.forEach((chunk) => {
      chunk.forEach((el, i) => {
        if (!this.visualizer.complexGraph.calculator.isPointVisible(el)) return
        if (chunk.length === 1) {
          this.drawChunk(el, 'start')
          this.drawChunk(el, 'end')
        } else {
          this.drawChunk(el, i === chunk.length - 1 ? 'end' : i === 0 ? 'start' : 'intermediate')
        }
      })
    })
  }

  protected drawChunk(el: VisualizerElement<undefined>, type: DamType = 'start') {
    const { complexGraph, row } = this.visualizer
    const { renderer, calculator } = complexGraph

    const s = clamp(calculator.area.width * 0.0011, 1, el.height) / 2

    const x = el.x + (type === 'end' ? el.width : 0) + (type === 'end' ? s * -1 : s)
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

    if (type !== 'intermediate') {
      this.drawEdge(x, y, s)
    }
  }

  protected abstract drawEdge(x: number, y: number, s: number): void
}
