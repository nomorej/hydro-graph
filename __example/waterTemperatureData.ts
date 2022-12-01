import { QwikStartWaterTemperature } from '../src'
import { Months } from '../src/utils/getMonths'
import { testData } from '../src/utils/testData'

export function waterTemperatureData(months: Months): QwikStartWaterTemperature {
  return {
    default: def(months),
  }
}

export function def(months: Months): QwikStartWaterTemperature['default'] {
  return testData(months)
}
