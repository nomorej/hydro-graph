import { QwikStartAirTemperature, distributeData } from '../src'

export function airTemperatureData(): QwikStartAirTemperature {
  return {
    max: max(),
    middle: middle(),
    min: min(),
    post: post(),
  }
}

function max(): QwikStartAirTemperature['max'] {
  return distributeData([
    {
      /**
       * Номер месяца соотвествует его положению указанному в параметре qwikStart.months
       * Тоесть, если август идёт первым, то date будет иметь слующий вид: [1, day?, hour?]
       */
      date: [1, 1],
      data: {
        value: -20,
      },
    },
    {
      date: [1, 10, 10],
      data: {
        value: 20,
      },
    },
    {
      date: [2],
      data: {
        value: -20,
        /**
         * переносит "курсор" в новую точку не связывая её с предыдущей
         */
        new: true,
      },
    },
    {
      date: [2, 15, 3],
      data: {
        value: 20,
      },
    },
    {
      date: [2, 15, 10],
      data: {
        value: 15,
      },
    },
  ])

  /**
   * Ещё вариант как можно указывать данные
   */
  return max_V2()
}

function max_V2(): QwikStartAirTemperature['max'] {
  return distributeData({
    1: [
      {
        day: 1,
        value: -20,
      },
      {
        day: 10,
        value: [
          {
            hour: 10,
            value: 20,
          },
        ],
      },
    ],
    2: [
      {
        day: 1,
        value: -20,
        new: true,
      },
      {
        day: 15,
        value: [
          {
            hour: 3,
            value: 20,
          },
          {
            hour: 10,
            value: 15,
          },
        ],
      },
    ],
  })
}

function middle(): QwikStartAirTemperature['middle'] {
  return distributeData([
    {
      date: [1],
      data: {
        value: -20,
      },
    },
    {
      date: [2],
      data: {
        value: 5,
      },
    },
  ])
}

function min(): QwikStartAirTemperature['min'] {
  return distributeData([
    {
      date: [1],
      data: {
        value: -25,
      },
    },
    {
      date: [2],
      data: {
        value: 10,
      },
    },
  ])
}

function post(): QwikStartAirTemperature['post'] {
  return distributeData([
    {
      date: [2],
      data: {
        value: 0,
      },
    },
    {
      date: [3],
      data: {
        value: 10,
      },
    },
  ])
}
