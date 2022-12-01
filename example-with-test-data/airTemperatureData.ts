import { distributeData, QwikStartAirTemperature } from '../src'
import { Months } from '../src/utils/getMonths'
import { testData } from '../src/utils/testData'

export function airTemperatureData(months: Months): QwikStartAirTemperature {
  return {
    max: max(months),
    middle: middle(months),
    min: min(months),
    post: post(months),
    sumTempAll: sumTempAll(months),
    sumTempSpring: sumTempSpring(months),
    sumTempAutumn: sumTempAutumn(months),
  }
}

function max(months: Months): QwikStartAirTemperature['max'] {
  return testData(months, { minus: true })
}

function middle(months: Months): QwikStartAirTemperature['middle'] {
  return testData(months, { minus: true })
}

function min(months: Months): QwikStartAirTemperature['min'] {
  return testData(months, { minus: true, skip: 0.4 })
}

function post(months: Months): QwikStartAirTemperature['post'] {
  return testData(months, { minus: true })
}

function sumTempAll(months: Months): QwikStartAirTemperature['sumTempAll'] {
  return distributeData([
    {
      date: [1, 2],
      data: {
        value: 10,
      },
    },
    {
      date: [1, 3],
      data: {
        value: 15,
      },
    },
    {
      date: [1, 4],
      data: {
        value: 3,
      },
    },
    {
      date: [1, 5],
      data: {
        value: 6,
      },
    },
  ])
}

function sumTempSpring(months: Months): QwikStartAirTemperature['sumTempSpring'] {
  return distributeData([
    {
      date: [2, 2],
      data: {
        value: 10,
      },
    },
    {
      date: [2, 3],
      data: {
        value: 15,
      },
    },
    {
      date: [2, 4],
      data: {
        value: 3,
      },
    },
    {
      date: [2, 5],
      data: {
        value: 6,
      },
    },
  ])
}

function sumTempAutumn(months: Months): QwikStartAirTemperature['sumTempAutumn'] {
  return distributeData([
    {
      date: [3, 2],
      data: {
        value: 10,
      },
    },
    {
      date: [3, 3],
      data: {
        value: 15,
      },
    },
    {
      date: [3, 4],
      data: {
        value: 3,
      },
    },
    {
      date: [3, 5],
      data: {
        value: 6,
      },
    },
  ])
}
