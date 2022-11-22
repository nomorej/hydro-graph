import { VisualizerGroupData } from '../core/Visualizer'
import { Range } from './ts'

type DayInMonthData<V> = Partial<{
  [KEY in number]: VisualizerGroupData<V>[number]
}>

type MonthInDayData<V> = Array<{
  date: [number, number?, Exclude<Range<24>, 0>?]
  data: {
    value: V
    new?: boolean
  }
}>

export function distributeData<V = number>(data: DayInMonthData<V> | MonthInDayData<V>) {
  const preparedData: VisualizerGroupData<V> = []

  if (Array.isArray(data)) {
    const dayInMonthData: DayInMonthData<V> = {}

    data.forEach((item) => {
      const monthPointer = item.date[0]
      const dayPointer = item.date[1] || 1
      const hourPointer = item.date[2]

      if (!dayInMonthData[monthPointer]) {
        dayInMonthData[monthPointer] = []
      }

      const matchedDay = dayInMonthData[monthPointer]?.find((item) => item.day === dayPointer)

      if (matchedDay && hourPointer && Array.isArray(matchedDay.value)) {
        matchedDay.value.push({
          hour: hourPointer,
          value: item.data.value,
          new: item.data.new,
        })
      } else {
        dayInMonthData[monthPointer]?.push({
          day: dayPointer,
          value: hourPointer
            ? [
                {
                  hour: hourPointer,
                  value: item.data.value,
                  new: item.data.new,
                },
              ]
            : item.data.value,
          new: hourPointer ? false : item.data.new,
        })
      }
    })

    for (let key in dayInMonthData) {
      preparedData[parseInt(key) - 1] = dayInMonthData[key] as VisualizerGroupData<V>[number]
    }
  } else {
    for (let key in data) {
      preparedData[parseInt(key) - 1] = data[key] as VisualizerGroupData<V>[number]
    }
  }

  for (let index = 0; index < preparedData.length; index++) {
    if (!preparedData[index]) preparedData[index] = []
  }

  return preparedData
}
