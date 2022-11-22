import { QwikStartWaterConsumption } from '../src'
import { Months } from '../src/utils/getMonths'
import { testData } from '../src/utils/testData'

export function waterСonsumptionData(months: Months): QwikStartWaterConsumption {
  return {
    qh: qh(months),
    measured: measured(months),
    calculated: calculated(months),
    operational: operational(months),
  }
}

function qh(months: Months): QwikStartWaterConsumption['qh'] {
  return testData(months, { max: 300 })
}

function measured(months: Months): QwikStartWaterConsumption['measured'] {
  return testData(months, { max: 300, skip: 0.8 })
}

function calculated(months: Months): QwikStartWaterConsumption['calculated'] {
  return testData(months, { max: 300 })
}

function operational(months: Months): QwikStartWaterConsumption['operational'] {
  return testData(months, { max: 300 })
}
