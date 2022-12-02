export function getMonthName(date: Date | string) {
  const d = new Date(date)
  return new Intl.DateTimeFormat('default', { month: 'long' }).format(d)
}
