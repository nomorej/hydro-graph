import type { Date } from './distributeData'
import { getMonthNumber, MonthNumber, Months } from './getMonths'

export function getDate(months: Months, date: string, useHours: boolean = false): Date {
  const dateObj = new Date(date)

  const month = getMonthNumber(months, (dateObj.getMonth() + 1) as MonthNumber)
  const day = dateObj.getDate()

  const result: Date = [month, day]

  if (useHours) {
    const hours = dateObj.getHours()
    result.push(hours)
  }

  return result
}
