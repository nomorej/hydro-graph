export interface TimelineMonthData {
  title: string
  daysNumber: number
  number: number
}

export type TimelineMonthsData = Array<TimelineMonthData>

export interface TimelineSegmentParameters {
  index: number
  title: number | string
  divider?: number
}

export abstract class TimelineSegment {
  public readonly index: number
  public readonly title: number | string
  public readonly divider: number | undefined
  public abstract date: string

  public x1: number
  public x2: number
  public width: number

  public x1Normalized: number
  public x2Normalized: number
  public widthNormalized: number

  constructor(parameters: TimelineSegmentParameters) {
    this.index = parameters.index
    this.title = parameters.title
    this.divider = parameters.divider

    this.x1 = 0
    this.x2 = 0
    this.width = 0

    this.x1Normalized = 0
    this.x2Normalized = 0
    this.widthNormalized = 0
  }
}

export class TimelineHour extends TimelineSegment {
  public readonly date: string
  public readonly day: TimelineDay
  public hoursBefore: number

  constructor(parameters: TimelineSegmentParameters & { day: TimelineDay }) {
    super(parameters)

    this.date = `${parameters.day.date} ${parameters.title.toString().padStart(2, '0')}ч`

    this.day = parameters.day
    this.hoursBefore = 0
  }
}

export class TimelineDay extends TimelineSegment {
  public readonly date: string
  public readonly hours: Array<TimelineHour>
  public readonly month: TimelineMonth
  public daysBefore: number

  constructor(parameters: TimelineSegmentParameters & { month: TimelineMonth }) {
    super(parameters)

    this.date = `${parameters.title.toString().padStart(2, '0')}.${parameters.month.date}`

    this.hours = []
    this.month = parameters.month
    this.daysBefore = 0

    for (let index = 0; index < this.divider!; index++) {
      this.hours[index] = new TimelineHour({
        index,
        title: index + 1,
        day: this,
      })
    }
  }

  public forEveryHour(callback: (hour: TimelineHour) => void) {
    this.hours.forEach((hour) => {
      callback(hour)
    })
  }
}

export class TimelineMonth extends TimelineSegment {
  public readonly days: Array<TimelineDay>
  public readonly date: string
  public readonly number: number

  constructor(parameters: TimelineSegmentParameters & { number: number }) {
    super(parameters)

    this.number = parameters.number

    this.date = this.number.toString().padStart(2, '0')
    this.days = []

    for (let index = 0; index < this.divider!; index++) {
      this.days[index] = new TimelineDay({
        divider: 23,
        index,
        title: index + 1,
        month: this,
      })
    }
  }

  public forEveryDay(callback: (day: TimelineDay) => void) {
    this.days.forEach((day) => {
      callback(day)
    })
  }
}

export class Timeline {
  public static getHourSegment(segment: TimelineSegment) {
    if (segment instanceof TimelineDay) {
      return segment.hours[0]
    } else if (segment instanceof TimelineMonth) {
      return segment.days[0].hours[0]
    }

    return segment as TimelineHour
  }

  public static getDaySegment(segment: TimelineSegment) {
    if (segment instanceof TimelineHour) {
      return segment.day
    } else if (segment instanceof TimelineMonth) {
      return segment.days[0]
    }

    return segment as TimelineDay
  }

  public static getMonthSegment(segment: TimelineSegment) {
    if (segment instanceof TimelineHour) {
      return segment.day.month
    } else if (segment instanceof TimelineDay) {
      return segment.month
    }

    return segment as TimelineMonth
  }

  public readonly months: Array<TimelineMonth>

  constructor(data: TimelineMonthsData) {
    this.months = []

    data.forEach((monthData, monthIndex) => {
      this.months[monthIndex] = new TimelineMonth({
        index: monthIndex,
        title: monthData.title,
        divider: monthData.daysNumber,
        number: monthData.number,
      })
    })

    const monthStep = 1 / data.length

    this.forEveryMonth((month) => {
      month.x1Normalized = month.index * monthStep
      month.x2Normalized = (month.index + 1) * monthStep
      month.widthNormalized = month.x2Normalized - month.x1Normalized

      const dayStep = monthStep / month.days.length

      month.forEveryDay((day) => {
        day.x1Normalized = month.x1Normalized + day.index * dayStep
        day.x2Normalized = month.x1Normalized + (day.index + 1) * dayStep
        day.widthNormalized = day.x2Normalized - day.x1Normalized

        const hourStep = dayStep / day.hours.length

        day.forEveryHour((hour) => {
          hour.x1Normalized = day.x1Normalized + hour.index * hourStep
          hour.x2Normalized = day.x1Normalized + (hour.index + 1) * hourStep
          hour.widthNormalized = hour.x2Normalized - hour.x1Normalized
        })
      })
    })

    let daysBefore = 0
    this.forEveryDay((data) => {
      data.day.daysBefore = daysBefore
      daysBefore++
    })

    let hoursBefore = 0
    this.forEveryHour((data) => {
      data.hour.hoursBefore = hoursBefore
      hoursBefore++
    })
  }

  public resize(width: number) {
    this.forEveryMonth((month) => {
      month.x1 = month.x1Normalized * width
      month.x2 = month.x2Normalized * width
      month.width = month.widthNormalized * width

      month.forEveryDay((day) => {
        day.x1 = day.x1Normalized * width
        day.x2 = day.x2Normalized * width
        day.width = day.widthNormalized * width

        day.forEveryHour((hour) => {
          hour.x1 = hour.x1Normalized * width
          hour.x2 = hour.x2Normalized * width
          hour.width = hour.widthNormalized * width
        })
      })
    })
  }

  public findSegment(month: number, day?: number, hour?: number) {
    let segment: TimelineSegment | undefined

    segment = this.months.find((m) => m.number === month)

    if (!segment) return

    if (day) {
      segment = (segment as TimelineMonth).days[day - 1]
    }

    if (!segment) return

    if (hour) {
      segment = (segment as TimelineDay).hours[hour - 1]
    }

    return segment
  }

  public forEveryDay(callback: (data: { month: TimelineMonth; day: TimelineDay }) => void) {
    this.months.forEach((month) => {
      month.days.forEach((day) => {
        callback({ month, day })
      })
    })
  }

  public forEveryHour(
    callback: (data: { month: TimelineMonth; day: TimelineDay; hour: TimelineHour }) => void
  ) {
    this.months.forEach((month) => {
      month.days.forEach((day) => {
        day.hours.forEach((hour) => {
          callback({ month, day, hour })
        })
      })
    })
  }

  public forEveryMonth(callback: (month: TimelineMonth) => void) {
    this.months.forEach((month) => {
      callback(month)
    })
  }
}
