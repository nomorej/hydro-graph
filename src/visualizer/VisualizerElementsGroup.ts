import { TimelineSegmentDateWithTime } from '../core/Timeline'
import { XY } from '../utils/ts'
import { VisualizerElement, VisualizerElementParameters } from './VisualizerElement'
import { VisualizerGroup, VisualizerGroupParameters } from './VisualizerGroup'

export type VisualizerElementsGroupData<V> = Array<VisualizerElementsGroupDataItem<V>>

export interface VisualizerElementsGroupDataItem<V = number>
  extends Omit<VisualizerElementParameters<V>, 'startSegment' | 'endSegment'> {
  date: TimelineSegmentDateWithTime
  fillDay?: boolean
}

export interface VisualizerElementsGroupParameters<V> extends VisualizerGroupParameters {
  name?: string
  color?: string
  data: VisualizerElementsGroupData<V>
  hitInfo?: HitInfoCallback<V>
}

export type HitInfoCallback<V> = (element: VisualizerElement<V>) => Array<string>

export abstract class VisualizerElementsGroup<
  T extends VisualizerElement<any> = VisualizerElement<any>
> extends VisualizerGroup {
  public readonly elements: Array<T>

  constructor(parameters: VisualizerElementsGroupParameters<T['value']>) {
    super(parameters)

    this.elements = []

    this.hitInfo = parameters.hitInfo || this.hitInfo

    parameters.data.forEach((item) => {
      let startSegment = this.visualizer.complexGraph.timeline.segments.find(
        (s) => s.date === item.date
      )

      if (!startSegment) {
        throw new Error(`Сегмент с датой ${item.date} не найден.`)
      }

      startSegment = item.fillDay ? startSegment.currentDaySegment : startSegment

      const endSegment = item.fillDay ? startSegment.nextDaySegment : startSegment.nextHourSegment

      this.elements.push(this.createElement({ ...item, startSegment, endSegment }))
    })

    this.elements.sort((a, b) => a.startSegment.index - b.startSegment.index)
  }

  public calculateMinMax() {
    const res = {
      min: 0,
      max: 0,
    }

    if (!this.getElementNumberValue) return res

    this.elements.forEach((element) => {
      const number = this.getElementNumberValue!(element)
      const numbers = Array.isArray(number) ? number : [number, number]
      res.min = numbers[0] < res.min ? numbers[0] : res.min
      res.max = numbers[1] > res.max ? numbers[1] : res.max
    })

    return res
  }

  protected abstract createElement(parameters: VisualizerElementParameters<T['value']>): T

  protected getElementNumberValue?(element: T): number | [number, number]

  public hitTest?(pointer: XY): VisualizerElement<any> | undefined | false

  public hitInfo?(element: VisualizerElement<any>): Array<string>
}
