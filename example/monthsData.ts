import { getMonths } from '../src'

export async function monthsData() {
  const months = getMonths(new Date('2021-01-01'), new Date('2021-12-31'))
  return months
}
