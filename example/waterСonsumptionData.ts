import { QwikStartWaterConsumption, distributeData } from '../src'

export async function waterСonsumptionData(): Promise<QwikStartWaterConsumption> {
  return {
    qh: await qh(),
    measured: await measured(),
    calculated: await calculated(),
    operational: await operational(),
  }
}

async function qh(): Promise<QwikStartWaterConsumption['qh']> {
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

async function measured(): Promise<QwikStartWaterConsumption['measured']> {
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

async function calculated(): Promise<QwikStartWaterConsumption['calculated']> {
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

async function operational(): Promise<QwikStartWaterConsumption['operational']> {
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
