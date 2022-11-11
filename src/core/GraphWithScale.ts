import { ComplexGraph } from './ComplexGraph'
import { Graph, GraphParameters } from './Graph'
import { SceneRenderData } from './Scene'

export type ScalePosition = 'right' | 'left'
export type ScaleSegment = { y: number; value: number }

export interface GraphWithScaleParameters<K extends string = 'default'> extends GraphParameters<K> {
  scaleTitle?: string
  scaleStep?: number
  scaleColor?: string
  scalePosition?: ScalePosition
  scaleSegmentColor?: string
  gridColor?: string
}

export interface SkipScaleSegmentParameters {
  segment: ScaleSegment
  index: number
  segments: Array<ScaleSegment>
}

export abstract class GraphWithScale<K extends string = 'default'> extends Graph<K> {
  protected readonly scaleTitle: string
  protected readonly scaleSegments: Array<ScaleSegment>
  protected readonly scaleScatter: number
  protected readonly scalePosition: ScalePosition
  public scaleColor: string
  public gridColor: string | undefined

  constructor(parameters: GraphWithScaleParameters<K>) {
    super(parameters)

    this.scaleTitle = parameters.scaleTitle || ''

    this.scaleSegments = []

    const scaleStep = parameters.scaleStep || 5

    this.min = Math.floor(this.min / scaleStep) * scaleStep
    this.max = Math.ceil(this.max / scaleStep) * scaleStep

    this.scaleScatter = this.max - this.min
    this.scalePosition = parameters.scalePosition || 'left'
    this.gridColor = parameters.gridColor
    this.scaleColor = parameters.scaleColor || 'black'

    for (let i = 0; i <= this.scaleScatter / scaleStep; i++) {
      this.scaleSegments[i] = {
        value: this.min + i * scaleStep,
        y: 0,
      }
    }
  }

  public override render(data: SceneRenderData) {
    this.scaleSegments.forEach((ss, i) => {
      ss.y =
        this.row.primitive.y2 - (this.row.primitive.height / (this.scaleSegments.length - 1)) * i
    })

    this.renderScale(data)
    super.render(data)
  }

  private renderScale({ renderer }: SceneRenderData) {
    const isLeft = this.scalePosition === 'left'

    const thickness = renderer.minSize * 0.002
    const dashSize = thickness * 4
    const sceneOffset = renderer.minSize * 0.01
    const x = isLeft ? this.row.primitive.x1 - dashSize * 2 : this.row.primitive.x2 + dashSize * 2

    renderer.context.lineWidth = thickness
    renderer.context.strokeStyle = this.scaleColor

    renderer.context.beginPath()
    renderer.context.moveTo(x, this.row.primitive.y1 - dashSize * 1.5)
    renderer.context.lineTo(x, this.row.primitive.y2)
    renderer.context.stroke()

    renderer.context.fillStyle = this.scaleColor

    renderer.context.beginPath()
    renderer.context.moveTo(x - dashSize, this.row.primitive.y1)
    renderer.context.lineTo(x, this.row.primitive.y1 - dashSize * 1.5)
    renderer.context.lineTo(x + dashSize, this.row.primitive.y1)
    renderer.context.fill()

    this.scaleSegments.forEach((segment, index, segments) => {
      const skip = this.skipScaleSegment({ segment, index, segments })
      const ds = skip ? dashSize * 0.5 : dashSize

      renderer.context.strokeStyle = this.scaleColor
      renderer.context.beginPath()
      renderer.context.moveTo(x - ds, segment.y)
      renderer.context.lineTo(x + ds, segment.y)
      renderer.context.stroke()

      if (skip) return

      renderer.context.fillStyle = 'black'
      renderer.context.font = `${ComplexGraph.globals.calculator.fontSize}px ${ComplexGraph.globals.font}`
      renderer.context.textBaseline = 'middle'
      renderer.context.textAlign = isLeft ? 'right' : 'left'
      renderer.context.fillText(
        segment.value.toString(),
        x - dashSize * 2 * (isLeft ? 1 : -1),
        segment.y
      )
    })

    if (this.gridColor) {
      renderer.context.strokeStyle = this.gridColor

      ComplexGraph.globals.calculator.clip(renderer, () => {
        this.scaleSegments.forEach((segment, index, segments) => {
          const skip = this.skipScaleSegment({ segment, index, segments })

          renderer.context.save()
          renderer.context.globalAlpha = segment.value == 0 ? 1 : !skip ? 0.3 : 0.1
          renderer.context.beginPath()
          renderer.context.moveTo(ComplexGraph.globals.calculator.clipArea.x1, segment.y)
          renderer.context.lineTo(ComplexGraph.globals.calculator.clipArea.x2, segment.y)
          renderer.context.stroke()
          renderer.context.restore()
        })
      })
    }

    renderer.context.save()
    renderer.context.font = `${ComplexGraph.globals.calculator.fontSize}px ${ComplexGraph.globals.font}`
    renderer.context.textBaseline = isLeft ? 'top' : 'bottom'
    renderer.context.textAlign = 'center'
    renderer.context.fillStyle = 'black'
    renderer.context.rotate(-Math.PI / 2)
    renderer.context.translate(
      this.row.primitive.y1 * -1 + (this.row.primitive.height / 2) * -1,
      isLeft
        ? ComplexGraph.globals.calculator.clipArea.x1 -
            ComplexGraph.globals.calculator.area.x1 +
            sceneOffset
        : ComplexGraph.globals.calculator.clipArea.x2 +
            ComplexGraph.globals.calculator.area.x1 -
            sceneOffset
    )
    renderer.context.fillText(this.scaleTitle, 0, 0)
    renderer.context.restore()
  }

  protected abstract skipScaleSegment(data: SkipScaleSegmentParameters): boolean
}
