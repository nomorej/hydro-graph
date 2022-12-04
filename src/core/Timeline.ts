import { getMonthName } from '../utils/timeline/getMonthName'
import { simplifyDate } from '../utils/timeline/simplifyDate'

export type TimelineParameters = Array<Date>

export interface TimelineSegmentParameters {
  index: number
  date: TimelineSegmentDateWithTime
  type: TimelineSegmentType
  number: number
  title: string
  daysBefore: number
}

export type TimelineSegmentType = 'month' | 'day' | 'hour'

export type TimelineSegmentDate = `${number}-${number}-${number}`

export type TimelineSegmentDateWithTime =
  `${number}-${number}-${number}T${number}:${number}:${number}`

export class TimelineSegment {
  public readonly index: number
  public readonly date: TimelineSegmentDateWithTime
  public readonly type: TimelineSegmentType
  public readonly number: number
  public readonly title: string
  public readonly daysBefore: number

  public x1: number
  public x2: number
  public width: number

  public x1Normalized: number
  public x2Normalized: number
  public widthNormalized: number

  public nextHourSegment: TimelineSegment
  public nextDaySegment: TimelineSegment
  public currentDaySegment: TimelineSegment

  constructor(parameters: TimelineSegmentParameters) {
    this.index = parameters.index
    this.date = parameters.date
    this.type = parameters.type
    this.number = parameters.number
    this.title = parameters.title
    this.daysBefore = parameters.daysBefore

    this.x1 = 0
    this.x2 = 0
    this.width = 0

    this.x1Normalized = 0
    this.x2Normalized = 0
    this.widthNormalized = 0

    this.nextHourSegment = null!
    this.nextDaySegment = null!
    this.currentDaySegment = null!
  }
}

export class Timeline {
  public readonly segments: Array<TimelineSegment>

  constructor(parameters: TimelineParameters) {
    this.segments = []

    let index = 0
    let prevYearMonth = simplifyDate(parameters[0]).slice(0, -3)
    let daysAcc = 0

    parameters.forEach((d, dayIndex) => {
      const simplifiedDate = simplifyDate(d)
      const currentYearMonth = simplifiedDate.slice(0, -3)
      const isMonth = d.getDate() === 1
      const monthNumber = d.getMonth()
      const dayNumber = dayIndex + 1 - daysAcc

      if (prevYearMonth !== currentYearMonth) {
        daysAcc += new Date(d.getFullYear(), monthNumber, 0).getDate()
      }

      prevYearMonth = currentYearMonth

      for (let hourNumber = 0; hourNumber <= 23; hourNumber++) {
        const date = `${simplifiedDate}T${hourNumber
          .toString()
          .padStart(2, '0')}:00:00` as TimelineSegmentDateWithTime
        const type = hourNumber === 0 ? (isMonth ? 'month' : 'day') : 'hour'
        const number = hourNumber === 0 ? (isMonth ? monthNumber : dayNumber) : hourNumber
        const title = hourNumber === 0 && isMonth ? getMonthName(d) : number.toString()

        this.segments[index] = new TimelineSegment({
          index: index,
          date,
          type,
          number,
          title,
          daysBefore: dayIndex,
        })

        index++
      }
    })

    const step = 1 / this.segments.length

    this.segments.forEach((s, index) => {
      s.x1Normalized = index * step
      s.x2Normalized = (index + 1) * step
      s.widthNormalized = s.x2Normalized - s.x1Normalized

      s.nextHourSegment = this.segments[index + 1] || s
      s.nextDaySegment =
        this.segments.slice(index + 1).find((s) => s.type === 'day') ||
        this.segments[this.segments.length - 1]
      s.currentDaySegment = this.segments
        .slice(Math.max(index - 23, 0), index + 1)
        .find((s) => s.type === 'day' || s.type === 'month')!
    })
  }

  public resize(width: number) {
    this.segments.forEach((s) => {
      s.x1 = s.x1Normalized * width
      s.x2 = s.x2Normalized * width
      s.width = s.widthNormalized * width
    })
  }
}
