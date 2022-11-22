import { QwikStartWaterConsumption, distributeData } from '../src'

export function waterСonsumptionData(): QwikStartWaterConsumption {
  return {
    qh: qh(),
    measured: measured(),
    calculated: calculated(),
    operational: operational(),
  }
}

function qh(): QwikStartWaterConsumption['qh'] {
  return distributeData([
    {
      date: [1, 1],
      data: {
        value: 20,
      },
    },
    {
      date: [1, 10, 10],
      data: {
        value: 6,
      },
    },
    {
      date: [2],
      data: {
        value: 20,
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
}

function measured(): QwikStartWaterConsumption['measured'] {
  return distributeData([
    {
      date: [1, 30],
      data: {
        value: 20,
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

function calculated(): QwikStartWaterConsumption['calculated'] {
  return distributeData([
    {
      date: [1],
      data: {
        value: 25,
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

function operational(): QwikStartWaterConsumption['operational'] {
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
