import { Calculator } from './Calculator'
import { Primitive } from './Primitive'
import { Renderer } from './Renderer'

export type ScalePosition = 'right' | 'left'
export type ScaleSegment = { y: number; value: number }

export interface ScaleParameters {
  title?: string
  step?: number
  color?: string
  position?: ScalePosition
  gridColor?: string
  abs?: boolean
  gridActive?: boolean
}

export interface SkipScaleSegmentParameters {
  segment: ScaleSegment
  index: number
  segments: Array<ScaleSegment>
}

export class Scale {
  public color: string
  public gridColor: string | undefined
  public readonly step: number
  public readonly abs: boolean
  public readonly segments: Array<ScaleSegment>
  public readonly title: string
  public readonly position: ScalePosition
  public scaleScatter: number
  public gridActive: boolean

  constructor(parameters: ScaleParameters) {
    this.step = parameters.step || 5
    this.abs = parameters.abs || false
    this.segments = []
    this.title = parameters.title || ''
    this.position = parameters.position || 'left'
    this.gridColor = parameters.gridColor
    this.color = parameters.color || 'black'

    this.scaleScatter = null!
    this.gridActive = parameters.gridActive || false
  }

  public create(min: number, max: number) {
    const scaleStep = this.step!

    min = Math.floor(min / scaleStep) * scaleStep
    max = Math.ceil(max / scaleStep) * scaleStep

    this.scaleScatter = max - min

    for (let i = 0; i <= this.scaleScatter / scaleStep; i++) {
      this.segments[i] = {
        value: min + i * scaleStep,
        y: 0,
      }
    }

    return { min, max }
  }

  public render(
    renderer: Renderer,
    calculator: Calculator,
    row: Primitive,
    font: string = 'sans-serif',
    paddingBottom = 0
  ) {
    const ry = row.y2 - paddingBottom
    const rh = row.height - paddingBottom

    this.segments.forEach((ss, i) => {
      ss.y = ry - (rh / (this.segments.length - 1)) * i
    })

    const isLeft = this.position === 'left'

    const thickness = renderer.minSize * 0.002
    const dashSize = thickness * 4
    const sceneOffset = renderer.minSize * 0.01
    const x = isLeft ? row.x1 - dashSize * 2 : row.x2 + dashSize * 2

    renderer.context.lineWidth = thickness / Math.min(devicePixelRatio, 2)
    renderer.context.strokeStyle = this.color

    renderer.context.beginPath()
    renderer.context.moveTo(x, row.y1 - dashSize * 1.5)
    renderer.context.lineTo(x, ry)
    renderer.context.stroke()

    renderer.context.fillStyle = this.color

    renderer.context.beginPath()
    renderer.context.moveTo(x - dashSize, row.y1)
    renderer.context.lineTo(x, row.y1 - dashSize * 1.5)
    renderer.context.lineTo(x + dashSize, row.y1)
    renderer.context.fill()

    this.segments.forEach((segment, index, segments) => {
      const skip = this.skip({ segment, index, segments })
      const ds = skip ? dashSize * 0.5 : dashSize

      renderer.context.strokeStyle = this.color
      renderer.context.beginPath()
      renderer.context.moveTo(x - ds, segment.y)
      renderer.context.lineTo(x + ds, segment.y)
      renderer.context.stroke()

      if (skip) return

      renderer.context.fillStyle = 'black'
      renderer.context.font = `${calculator.fontSize}px ${font}`
      renderer.context.textBaseline = 'middle'
      renderer.context.textAlign = isLeft ? 'right' : 'left'
      renderer.context.fillText(
        (this.abs ? Math.abs(segment.value) : segment.value).toString(),
        x - dashSize * 2 * (isLeft ? 1 : -1),
        segment.y
      )
    })

    if (this.gridColor && this.gridActive) {
      renderer.context.strokeStyle = this.gridColor

      calculator.clip(renderer, () => {
        this.segments.forEach((segment, index, segments) => {
          const skip = this.skip({ segment, index, segments })

          renderer.context.save()
          renderer.context.lineWidth = 1 / Math.min(devicePixelRatio, 2)
          renderer.context.globalAlpha = segment.value == 0 ? 1 : !skip ? 0.3 : 0.1
          renderer.context.beginPath()

          const y = Math.floor(segment.y) + 0.5

          renderer.context.moveTo(calculator.clipArea.x1, y)
          renderer.context.lineTo(calculator.clipArea.x2, y)
          renderer.context.stroke()
          renderer.context.restore()
        })
      })
    }

    renderer.context.save()
    renderer.context.font = `${calculator.fontSize}px ${font}`
    renderer.context.textBaseline = isLeft ? 'top' : 'bottom'
    renderer.context.textAlign = 'center'
    renderer.context.fillStyle = 'black'
    renderer.context.rotate(-Math.PI / 2)
    renderer.context.translate(
      row.y1 * -1 + (row.height / 2) * -1,
      isLeft
        ? calculator.clipArea.x1 - calculator.area.x1 + sceneOffset
        : calculator.clipArea.x2 + calculator.area.x1 - sceneOffset
    )
    renderer.context.fillText(this.title, 0, 0)
    renderer.context.restore()
  }

  public skip(data: SkipScaleSegmentParameters) {
    if (data.segments.length === 2) {
      return false
    } else if (data.index === data.segments.length) {
      return true
    } else if (data.index % 2 !== 0) {
      return true
    }
  }
}
