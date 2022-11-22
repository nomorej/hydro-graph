import { VisualizerGroupData } from '../core/Visualizer'
import { Months } from './getMonths'

export interface TestDataParameters {
  minus?: boolean
  max?: number
  skip?: number
  hours?: boolean
}

export function testData(
  months: Months,
  { minus = false, max = 30, skip = -1, hours = false }: TestDataParameters = {}
): VisualizerGroupData<any> {
  const data: VisualizerGroupData<any> = []

  months.forEach((month, monthIndex) => {
    data[monthIndex as 0] = []
    for (let dayIndex = 0; dayIndex < month.daysNumber; dayIndex++) {
      if (Math.random() < skip) continue

      if (!hours) {
        const value = minus
          ? Math.floor(Math.random() * max * 2 - max)
          : Math.floor(Math.random() * max)

        const d: VisualizerGroupData<number>[number][number] = {
          day: (dayIndex + 1) as 1,
          value: value,
        }

        data[monthIndex as 0]!.push(d as any)
      } else {
        const d: VisualizerGroupData<number>[number][number] = {
          day: (dayIndex + 1) as 1,
          value: [],
        }

        for (let hourIndex = 0; hourIndex < 23; hourIndex++) {
          if (Math.random() < skip) continue

          if (Array.isArray(d.value)) {
            d.value.push({
              hour: hourIndex + 1,
              value: minus
                ? Math.floor(Math.random() * max * 2 - max)
                : Math.floor(Math.random() * max),
            })
          }
        }

        data[monthIndex as 0]!.push(d as any)
      }
    }
  })
  return data
}
