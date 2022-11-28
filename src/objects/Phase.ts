import { Object, ObjectParameters } from '../core/Object'
import { TimelineSegment } from '../core/Timeline'

export interface PhaseParameters extends ObjectParameters {
  shortName?: string

  start: {
    month: number
    day?: number
    hour?: number
  }

  end: {
    month: number
    day?: number
    hour?: number
    fill?: boolean
  }

  fontColor?: string
  backgroundColor?: string
  edgeColor?: string
}

export class Phase extends Object {
  private start: TimelineSegment
  private end: TimelineSegment

  private startParameters: PhaseParameters['start']
  private endParameters: PhaseParameters['end']

  public readonly shortName: string

  private readonly fillEndSegment: boolean

  private readonly fontColor: string
  private readonly backgroundColor: string
  private readonly edgeColor: string

  constructor(parameters: PhaseParameters) {
    super({ name: '', ...parameters })

    this.start = null!
    this.end = null!

    this.startParameters = parameters.start
    this.endParameters = parameters.end

    this.shortName = parameters.shortName || this.name || ''

    this.fillEndSegment = parameters.end.fill || false

    this.fontColor = parameters.fontColor || 'darkblue'
    this.backgroundColor = parameters.backgroundColor || 'lightblue'
    this.edgeColor = parameters.edgeColor || 'grey'
  }

  public override onCreate() {
    const start = this.complexGraph.timeline.findSegment(
      this.startParameters!.month,
      this.startParameters!.day,
      this.startParameters!.hour
    )

    if (!start) {
      throw new Error(
        `Сегмент со следующими параметрами [month:${this.startParameters!.month}, day:${
          this.startParameters!.day
        }, hour:${this.startParameters!.hour}] не найден`
      )
    }

    const end = this.complexGraph.timeline.findSegment(
      this.endParameters!.month,
      this.endParameters!.day,
      this.endParameters!.hour
    )

    if (!end) {
      throw new Error(
        `Сегмент со следующими параметрами [month:${this.endParameters!.month}, day:${
          this.endParameters!.day
        }, hour:${this.endParameters!.hour}] не найден`
      )
    }

    this.start = start
    this.end = end
  }

  public onRender() {
    const { renderer } = this.complexGraph

    this.complexGraph.calculator.clip(renderer, () => {
      renderer.context.fillStyle = this.backgroundColor

      if (!this.complexGraph.calculator.isSegmentVisible(this.start, this.end)) return

      const delta = (this.fillEndSegment ? this.end.x2 : this.end.x1) - this.start.x1

      const middle = this.complexGraph.calculator.area.x1 + this.start.x1 + delta / 2
      const offsetY =
        (this.complexGraph.calculator.clipArea.height - this.complexGraph.calculator.area.height) /
        2

      renderer.context.fillRect(
        this.complexGraph.calculator.area.x1 + this.start.x1,
        this.complexGraph.calculator.clipArea.y1,
        delta,
        this.complexGraph.calculator.clipArea.height
      )

      renderer.context.fillStyle = this.fontColor
      renderer.context.font = `${this.complexGraph.calculator.fontSize}px ${this.complexGraph.font}`
      renderer.context.textBaseline = 'middle'
      renderer.context.textAlign = 'center'

      let textSize = renderer.context.measureText(this.name!)
      const s = textSize.width > delta
      const title = s ? this.shortName! : this.name!
      textSize = renderer.context.measureText(title)
      const xs = textSize.width > delta

      if (xs) {
        renderer.context.font = `${this.complexGraph.calculator.fontSize * 0.5}px ${
          this.complexGraph.font
        }`
      }

      renderer.context.fillText(title, middle, this.complexGraph.calculator.clipArea.y2 - offsetY)

      renderer.context.save()
      renderer.context.setLineDash([10])
      renderer.context.strokeStyle = this.edgeColor
      renderer.context.lineWidth = 1
      renderer.context.beginPath()
      renderer.context.moveTo(
        this.complexGraph.calculator.area.x1 + this.start.x1 + 0.5,
        this.complexGraph.calculator.clipArea.y1
      )
      renderer.context.lineTo(
        this.complexGraph.calculator.area.x1 + this.start.x1 + 0.5,
        this.complexGraph.calculator.clipArea.y2
      )
      renderer.context.stroke()
      renderer.context.restore()
    })
  }
}
