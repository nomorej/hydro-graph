export function simplifyDate(date: Date) {
  return date.toISOString().slice(0, 10)
}
