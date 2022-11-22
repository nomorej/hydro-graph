import { QwikStartAirTemperature } from '../src'
import { Months } from '../src/utils/getMonths'
import { testData } from '../src/utils/testData'

export function airTemperatureData(months: Months): QwikStartAirTemperature {
  return {
    max: max(months),
    middle: middle(months),
    min: min(months),
    post: post(months),
  }
}

function max(months: Months): QwikStartAirTemperature['max'] {
  return testData(months, { minus: true })
}

function middle(months: Months): QwikStartAirTemperature['middle'] {
  return testData(months, { minus: true })
}

function min(months: Months): QwikStartAirTemperature['min'] {
  return testData(months, { minus: true })
}

function post(months: Months): QwikStartAirTemperature['post'] {
  return testData(months, { minus: true })
}
