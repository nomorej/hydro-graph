import { QwikStartAirTemperature, distributeData, Months } from '../src'

export async function airTemperatureData(months: Months): Promise<QwikStartAirTemperature> {
  return {
    max: await max(months),
    middle: await middle(months),
    min: await min(months),
    post: await post(months),
    sumTempAll: await sumTempAll(months),
    sumTempSpring: await sumTempSpring(months),
    sumTempAutumn: await sumTempAutumn(months),
  }
}

async function max(months: Months): Promise<QwikStartAirTemperature['max']> {
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
      date: [1, 15, 10],
      data: {
        value: 20,
      },
    },
    {
      date: [2, 10],
      data: {
        value: 30,
        comment: 'Этот комментарий появится в конце подсказки',
      },
    },
    {
      date: [2, 12],
      data: {
        value: 5,
        comment: ['G: 10', 'L: 10'],
      },
    },
    {
      date: [2, 13],
      data: {
        value: 15,
      },
    },
    {
      date: [2, 14],
      data: {
        value: 10,
      },
    },
    {
      date: [2, 15],
      data: {
        value: 12,
        /**
         * График автоматически прерывается если
         * расстояние между точками больше трех дней,
         * но можно если что указать этот параметр
         */
        new: true,
      },
    },
    {
      date: [2, 18],
      data: {
        value: 22,
      },
    },
  ])
}

async function middle(months: Months): Promise<QwikStartAirTemperature['middle']> {
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

async function min(months: Months): Promise<QwikStartAirTemperature['min']> {
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

async function post(months: Months): Promise<QwikStartAirTemperature['post']> {
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

async function sumTempAll(months: Months): Promise<QwikStartAirTemperature['sumTempAll']> {
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

async function sumTempSpring(months: Months): Promise<QwikStartAirTemperature['sumTempSpring']> {
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

async function sumTempAutumn(months: Months): Promise<QwikStartAirTemperature['sumTempAutumn']> {
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
