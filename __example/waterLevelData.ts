import { QwikStartWaterLevel } from '../src'
import { Months } from '../src/utils/getMonths'
import { testData } from '../src/utils/testData'

export function waterLevelData(months: Months): QwikStartWaterLevel {
  return {
    default: def(months),
    adverse: 100,
    dangerous: 150,
  }
}

export function def(months: Months): QwikStartWaterLevel['default'] {
  return testData(months, { max: 200 })
}
