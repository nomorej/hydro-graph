import { Range } from './ts'

export type MonthName =
  | 'Октябрь'
  | 'Ноябрь'
  | 'Декабрь'
  | 'Январь'
  | 'Февраль'
  | 'Март'
  | 'Апрель'
  | 'Май'
  | 'Июнь'
  | 'Июль'
  | 'Август'
  | 'Сентябрь'

export type MonthIndex = Exclude<Range<13>, 0>

export interface Month {
  title: MonthName
  daysNumber: number
  number: MonthIndex
}

export type Months = Array<Month>

export function getMonths(
  desired: Array<MonthName | MonthIndex> | 'all' | { from: number; to: number },
  {
    leapYear = false,
    offset = 0,
  }: {
    leapYear?: boolean
    offset?: number
  } = {}
): Months {
  const months: Months = [
    {
      title: 'Январь',
      daysNumber: 31,
      number: 1,
    },
    {
      title: 'Февраль',
      daysNumber: leapYear ? 29 : 28,
      number: 2,
    },
    {
      title: 'Март',
      daysNumber: 31,
      number: 3,
    },
    {
      title: 'Апрель',
      daysNumber: 30,
      number: 4,
    },
    {
      title: 'Май',
      daysNumber: 31,
      number: 5,
    },
    {
      title: 'Июнь',
      daysNumber: 30,
      number: 6,
    },
    {
      title: 'Июль',
      daysNumber: 31,
      number: 7,
    },
    {
      title: 'Август',
      daysNumber: 31,
      number: 8,
    },
    {
      title: 'Сентябрь',
      daysNumber: 30,
      number: 9,
    },
    {
      title: 'Октябрь',
      daysNumber: 31,
      number: 10,
    },
    {
      title: 'Ноябрь',
      daysNumber: 30,
      number: 11,
    },
    {
      title: 'Декабрь',
      daysNumber: 31,
      number: 12,
    },
  ]

  let result: Months = []

  if (desired === 'all') {
    result = months
  } else if (Array.isArray(desired)) {
    result = desired
      .map((title) => {
        if (typeof title === 'number') {
          return months[title - 1]
        } else {
          return months.find((m) => {
            return m.title === title
          })
        }
      })
      .filter((m) => !!m) as Months
  } else {
    for (let index = desired.from; index <= desired.to; index++) {
      result[index - 1] = months[(index - 1) % months.length]
    }
  }

  if (offset) {
    result = [...result.slice(offset, result.length), ...result.slice(0, offset)]
  }

  return result
}
