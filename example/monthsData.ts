import { getMonths } from '../src'

export async function monthsData() {
  /**
   * 12 месяцев
   */
  return getMonths('all')

  /**
   * 2 года
   */
  getMonths({
    from: 1,
    to: 24,
  })

  /**
   * только 3 месяца
   */
  getMonths(['Июнь', 'Июль', 'Август'])

  /**
   * 12 месяцев с измененным порядком
   */
  getMonths('all', { offset: -3 })

  /**
   * год високосный
   */
  getMonths('all', { leapYear: true })
}
