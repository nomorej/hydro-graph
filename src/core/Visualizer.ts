import { Object, ObjectParameters } from './Object'
import { Primitive } from './Primitive'
import { Scale, ScaleParameters } from './Scale'
import { Timeline, TimelineSegment } from './Timeline'

export type VisualizerElementComment = string | Array<string>

export interface VisualizerElementParameters<V> {
  segment: TimelineSegment
  nextSegment?: TimelineSegment
  value: V
  new?: boolean
  comment?: VisualizerElementComment
}

export class VisualizerElement<V> {
  public x: number
  public y: number
  public width: number
  public height: number
  public new?: boolean
  public readonly segment: TimelineSegment
  public nextSegment?: TimelineSegment
  public readonly value: V
  public readonly comment: Array<string>

  constructor(parameters: VisualizerElementParameters<V>) {
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.new = parameters.new
    this.segment = parameters.segment
    this.nextSegment = parameters.nextSegment
    this.value = parameters.value
    this.comment =
      parameters.comment && Array.isArray(parameters.comment)
        ? parameters.comment
        : parameters.comment
        ? [parameters.comment]
        : []
  }
}

export type VisualizerGroupData<V> = Array<Array<VisualizerDayData<V>>>

export type VisualizerDayData<V, H = VisualizerHourData<V>> = {
  day: number
  value: V | Array<H>
  new?: boolean
  comment?: VisualizerElementComment
}

export type VisualizerHourData<V> = {
  hour: number
  value: V
  new?: boolean
  comment?: VisualizerElementComment
}

export interface VisualizerGroupParametersData<V> {
  title?: string
  color?: string
  months: VisualizerGroupData<V>
}

export interface VisualizerGroupParameters<V, K extends string = 'default'> {
  name: K
  data: VisualizerGroupParametersData<V>
  maxDaysGap?: number
}

export class VisualizerGroup<V, K extends string = 'default'> {
  public readonly name: K
  public readonly title?: string
  public readonly color: string
  public monthsData: VisualizerGroupData<V>
  public elements: Array<VisualizerElement<V>>
  public isVisible: boolean
  private readonly maxDaysGap?: number

  constructor(public readonly dr: Visualizer<V, K>, parameters: VisualizerGroupParameters<V, K>) {
    this.name = parameters.name
    this.title = parameters.data.title
    this.color = parameters.data.color || 'black'
    this.monthsData = parameters.data.months
    this.elements = []
    this.isVisible = true
    this.maxDaysGap = parameters.maxDaysGap
  }

  public generateElements(timeline: Timeline) {
    this.elements = []

    this.monthsData.forEach((monthData, monthIndex) => {
      monthData.forEach((dayData) => {
        if (Array.isArray(dayData.value)) {
          const daySegment = timeline.months[monthIndex].days[dayData.day - 1]

          dayData.value.forEach((hourData, _index) => {
            this.elements.push(
              new VisualizerElement({
                segment: daySegment.hours[hourData.hour - 1],
                ...hourData,
              })
            )
          })
        } else {
          this.elements.push(
            new VisualizerElement({
              segment: timeline.months[monthIndex].days[dayData.day - 1],
              ...(dayData as any),
            })
          )
        }
      })
    })

    this.elements.sort(
      (a, b) =>
        Timeline.getHourSegment(a.segment).hoursBefore -
        Timeline.getHourSegment(b.segment).hoursBefore
    )

    if (this.maxDaysGap) {
      let previous: VisualizerElement<any> | undefined
      let ind = 0

      this.elements.forEach((el) => {
        if (!el.new) {
          if (
            ind > 1 &&
            previous &&
            Timeline.getDaySegment(el.segment).daysBefore -
              Timeline.getDaySegment(previous.segment).daysBefore >
              this.maxDaysGap!
          ) {
            el.new = true
            ind = 0
          }
        } else {
          ind = 0
        }

        ind++
        previous = el
      })
    }
  }

  public show() {
    this.dr.show(this.name)
  }

  public hide() {
    this.dr.hide(this.name)
  }
}

export interface VisualizerParameters<V, K extends string = 'default'> extends ObjectParameters {
  row: number
  rowFactor?: number
  groups?: {
    [KEY in K]?: VisualizerGroupParametersData<V>
  }
  scale?: ScaleParameters
  paddingBottom?: number
  maxDaysGap?: number
}

export abstract class Visualizer<V, K extends string = 'default'> extends Object {
  public readonly rowParameter: number
  public readonly rowFactorParameter: number

  public readonly groups: Map<K, VisualizerGroup<V, K>>
  public readonly row: Primitive = null!

  protected min: number = null!
  protected max: number = null!

  public readonly scale?: Scale
  private readonly _paddingBottom: number

  constructor(parameters: VisualizerParameters<V, K>) {
    super(parameters)

    this.rowParameter = parameters.row
    this.rowFactorParameter = parameters.rowFactor || 1
    this.groups = new Map()

    for (const key in parameters.groups) {
      if (parameters.groups[key as K]) {
        this.groups.set(
          key as K,
          new VisualizerGroup(this, {
            name: key as K,
            data: parameters.groups[key]!,
            maxDaysGap: parameters.maxDaysGap,
          })
        )
      }
    }

    if (parameters.scale) {
      this.scale = new Scale(parameters.scale)
    }

    this._paddingBottom = parameters.paddingBottom || 0
  }

  get paddingBottom() {
    return this._paddingBottom * this.row.height
  }

  public override onCreate() {
    const { timeline } = this.complexGraph

    // @ts-ignore
    this.row = this.complexGraph.rows.rows[this.rowParameter!]

    this.groups.forEach((group) => {
      group.generateElements(timeline)
    })

    this.min = 0
    this.max = -999999999

    this.calclulateMinMax?.()

    if (this.scale) {
      const { min, max } = this.scale.create(this.min, this.max)
      this.min = min
      this.max = max
    }
  }

  public onRender() {
    const { renderer, calculator, font } = this.complexGraph

    const heightStep = (this.row.height - this.paddingBottom) / Math.max(1, this.max - this.min)

    this.resizeElements(heightStep)

    this.scale?.render(renderer, calculator, this.row, font, this.paddingBottom)

    this.renderWithoutClip?.()

    this.complexGraph.calculator.clip(this.complexGraph.renderer, () => {
      this.renderWithClip?.(heightStep)
    })
  }

  public show(key?: K) {
    if (key && this.groups.has(key)) {
      this.groups.get(key)!.isVisible = true
      this.complexGraph.renderer.redraw()
    } else {
      this.groups.forEach((group) => {
        group.isVisible = true
      })

      this.complexGraph.show(this)
    }
  }

  public hide(key?: K) {
    if (key && this.groups.has(key)) {
      this.groups.get(key)!.isVisible = false
      this.complexGraph.renderer.redraw()
    } else {
      this.groups.forEach((group) => {
        group.isVisible = false
      })
      this.complexGraph.hide(this)
    }
  }

  public showGrid() {
    if (this.scale) {
      this.scale.gridActive = true
      this.complexGraph.renderer.redraw()
    }
  }

  public hideGrid() {
    if (this.scale) {
      this.scale.gridActive = false
      this.complexGraph.renderer.redraw()
    }
  }

  protected calclulateMinMax?(): void
  protected abstract resizeElements(heightStep: number): void

  protected renderWithoutClip?(): void
  protected renderWithClip?(heightStep: number): void
}
