export function getMonths(start: Date, end: Date) {
  const result: Array<Date> = []
  let current = new Date(start)

  while (current <= end) {
    result.push(current) && (current = new Date(current)) && current.setDate(current.getDate() + 1)
  }

  return result
}
