import { MonthData, MonthsData } from './UtilsTS'

export abstract class UtilsMonth {
  public static maxMonthValue(data: MonthData) {
    let max = 0

    data.forEach((v) => {
      if (v.value > max) {
        max = v.value
      }
    })

    return max
  }

  public static minMonthValue(data: MonthData) {
    let min = 0

    data.forEach((v) => {
      if (v.value < min) {
        min = v.value
      }
    })

    return min
  }

  public static maxMonthsValue(data: MonthsData) {
    let max = 0

    data.forEach((monthData) => {
      const arrayMax = this.maxMonthValue(monthData)

      if (arrayMax > max) {
        max = arrayMax
      }
    })
    return max
  }

  public static minMonthsValue(data: MonthsData) {
    let min = 0

    data.forEach((monthData) => {
      const arrayMin = this.minMonthValue(monthData)

      if (arrayMin < min) {
        min = arrayMin
      }
    })
    return min
  }
}
