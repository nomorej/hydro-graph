import { Object, ObjectParameters } from '../core/Object'
import { TimelineSegment, TimelineSegmentDateWithTime } from '../core/Timeline'

export interface PhaseParameters extends ObjectParameters {
  shortName?: string

  start: TimelineSegmentDateWithTime
  end: TimelineSegmentDateWithTime
  fill?: boolean

  fontColor?: string
  backgroundColor?: string
  edgeColor?: string
}

export class Phase extends Object {
  private start: TimelineSegment
  private end: TimelineSegment

  private readonly startParam: PhaseParameters['start']
  private readonly endParam: PhaseParameters['end']
  private readonly fillParam: PhaseParameters['fill']

  public readonly shortName: string

  private readonly fontColor: string
  private readonly backgroundColor: string
  private readonly edgeColor: string

  constructor(parameters: PhaseParameters) {
    super({ name: '', ...parameters })

    this.start = null!
    this.end = null!

    this.startParam = parameters.start
    this.endParam = parameters.end
    this.fillParam = parameters.fill

    this.shortName = parameters.shortName || this.name || ''

    this.fontColor = parameters.fontColor || 'darkblue'
    this.backgroundColor = parameters.backgroundColor || 'lightblue'
    this.edgeColor = parameters.edgeColor || 'darkgrey'

    const start = this.complexGraph.timeline.segments.find((s) => s.date === this.startParam)

    if (!start) {
      throw new Error(`[Phase] Стартовый сегмент не найден ${this.startParam}`)
    }

    const end = this.complexGraph.timeline.segments.find((s) => s.date === this.endParam)

    if (!end) {
      throw new Error(`[Phase] Конечный сегмент не найден ${this.startParam}`)
    }

    this.start = start
    this.end = this.fillParam ? end.nextDaySegment : end
  }

  public onRender() {
    const { renderer } = this.complexGraph

    this.complexGraph.calculator.clip(renderer, () => {
      renderer.context.fillStyle = this.backgroundColor

      if (!this.complexGraph.calculator.isSegmentVisible(this.start, this.end)) return

      const delta = this.end.x2 - this.start.x1

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
      renderer.context.setLineDash([5])
      renderer.context.strokeStyle = this.edgeColor
      renderer.context.lineWidth = 1 / this.complexGraph.renderer.pixelRatio
      renderer.context.beginPath()
      renderer.context.moveTo(
        this.complexGraph.calculator.area.x1 + this.start.x1,
        this.complexGraph.calculator.clipArea.y1
      )
      renderer.context.lineTo(
        this.complexGraph.calculator.area.x1 + this.start.x1,
        this.complexGraph.calculator.clipArea.y2
      )
      renderer.context.stroke()
      renderer.context.restore()
    })
  }
}

const phasesPresets = {
  ОР: {
    fontColor: '#C08C50',
    backgroundColor: '#FEFFD7',
    name: 'Открытое русло',
    shortName: 'ОР',
  },
  ОПП: {
    fontColor: '#C86546',
    backgroundColor: '#FBE9DD',
    name: 'Осенний переходный',
    shortName: 'ОПП',
  },
  ЛД: {
    fontColor: '#243372',
    backgroundColor: '#D5F2FA',
    name: 'Ледостав',
    shortName: 'ЛД',
  },
  ВПП: {
    fontColor: '#2F7B3A',
    backgroundColor: '#E0FFDF',
    name: 'Весенний переходный',
    shortName: 'ВПП',
  },
  ЗАР: {
    fontColor: '#128B8C',
    backgroundColor: '#BFD4D0',
    name: 'Зарастание',
    shortName: 'ЗАР',
  },
}

export type PhasesParameters = Array<{
  type: keyof typeof phasesPresets
  start: PhaseParameters['start']
  end: PhaseParameters['end']
}>

export function createPhases(parameters: PhasesParameters) {
  parameters.forEach((phase, i, arr) => {
    new Phase({
      ...phasesPresets[phase.type],
      start: phase.start,
      end: phase.end,
      fill: i === arr.length - 1,
    })
  })
}
