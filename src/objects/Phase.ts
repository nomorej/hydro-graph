import { ComplexGraph } from '../core/ComplexGraph'
import { Object, ObjectParameters } from '../core/Object'
import { SceneRenderData } from '../core/Scene'
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
  }

  colors: {
    font: string
    background: string
  }
}

export class Phase extends Object {
  private readonly start: TimelineSegment
  private readonly end: TimelineSegment
  public readonly colors: PhaseParameters['colors']
  public readonly shortName: string

  constructor(parameters: PhaseParameters) {
    super({ name: '', ...parameters })

    const start = ComplexGraph.globals.timeline.findSegment(
      parameters.start.month,
      parameters.start.day,
      parameters.start.hour
    )

    if (!start) {
      throw new Error(
        `Сегмент со следующими параметрами [month:${parameters.start.month}, day:${parameters.start.day}, hour:${parameters.start.hour}] не найден`
      )
    }

    const end = ComplexGraph.globals.timeline.findSegment(
      parameters.end.month,
      parameters.end.day,
      parameters.end.hour
    )

    if (!end) {
      throw new Error(
        `Сегмент со следующими параметрами [month:${parameters.end.month}, day:${parameters.end.day}, hour:${parameters.end.hour}] не найден`
      )
    }

    this.start = start
    this.end = end

    this.colors = parameters.colors
    this.shortName = parameters.shortName || this.name || ''
  }

  public render({ renderer }: SceneRenderData) {
    ComplexGraph.globals.calculator.clip(renderer, () => {
      renderer.context.fillStyle = this.colors.background

      const delta = this.end.x1 - this.start.x1
      const middle = ComplexGraph.globals.calculator.area.x1 + this.start.x1 + delta / 2
      const offsetY =
        (ComplexGraph.globals.calculator.clipArea.height -
          ComplexGraph.globals.calculator.area.height) /
        2

      renderer.context.fillRect(
        ComplexGraph.globals.calculator.area.x1 + this.start.x1,
        ComplexGraph.globals.calculator.clipArea.y1,
        delta,
        ComplexGraph.globals.calculator.clipArea.height
      )

      renderer.context.fillStyle = this.colors.font
      renderer.context.font = `${ComplexGraph.globals.calculator.fontSize}px ${ComplexGraph.globals.font}`
      renderer.context.textBaseline = 'middle'
      renderer.context.textAlign = 'center'

      let textSize = renderer.context.measureText(this.name!)
      const s = textSize.width > delta
      const title = s ? this.shortName! : this.name!
      textSize = renderer.context.measureText(title)
      const xs = textSize.width > delta

      if (xs) {
        renderer.context.font = `${ComplexGraph.globals.calculator.fontSize * 0.5}px ${
          ComplexGraph.globals.font
        }`
      }

      renderer.context.fillText(
        title,
        middle,
        ComplexGraph.globals.calculator.clipArea.y2 - offsetY
      )
    })
  }
}
