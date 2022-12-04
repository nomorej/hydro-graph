import { TimelineSegment } from '../core/Timeline'

export interface VisualizerElementParameters<V> {
  startSegment: TimelineSegment
  endSegment: TimelineSegment
  value: V
  comment?: string | Array<string>
}

export class VisualizerElement<T> {
  public x: number
  public y: number

  public width: number
  public height: number

  public startSegment: TimelineSegment
  public endSegment: TimelineSegment

  public readonly value: T

  public readonly comment: Array<string>

  constructor(parameters: VisualizerElementParameters<T>) {
    this.x = 0
    this.y = 0

    this.width = 0
    this.height = 0

    this.startSegment = parameters.startSegment
    this.endSegment = parameters.endSegment

    this.value = parameters.value

    this.comment = parameters.comment
      ? Array.isArray(parameters.comment)
        ? parameters.comment
        : [parameters.comment]
      : []
  }
}
