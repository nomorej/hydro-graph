import { ComplexGraph } from './core/ComplexGraph'
import { AirTemperature } from './graphs/AirTemperature'
import { Precipitation } from './graphs/Precipitation'

// --- TEST

const container = document.createElement('div')

container.style.cssText = `
  width: 100%;
  height: 100%;
`

document.getElementById('graph')?.appendChild(container)

const cg = new ComplexGraph({
  container,
  rows: [2, 1, 1, 1],
  months: [
    {
      title: 'Октябрь',
      daysNumber: 31,
    },
    {
      title: 'Ноябрь',
      daysNumber: 30,
    },
    {
      title: 'Декабрь',
      daysNumber: 31,
    },
    {
      title: 'Январь',
      daysNumber: 31,
    },
    {
      title: 'Февраль',
      daysNumber: 28,
    },
    {
      title: 'Март',
      daysNumber: 31,
    },
    {
      title: 'Апрель',
      daysNumber: 30,
    },
    {
      title: 'Май',
      daysNumber: 31,
    },
    {
      title: 'Июнь',
      daysNumber: 30,
    },
    {
      title: 'Июль',
      daysNumber: 31,
    },
    {
      title: 'Август',
      daysNumber: 31,
    },
    {
      title: 'Сентябрь',
      daysNumber: 30,
    },
    {
      title: 'Октябрь',
      daysNumber: 31,
    },
  ],
})

cg.add(AirTemperature, {
  name: 'airTemperature',
  row: 0,
  scaleName: 'asd',
  data: {
    default: [
      [
        {
          day: 1,
          value: -20,
        },
        {
          day: 31,
          value: 30,
        },
      ],
    ],
  },
})

cg.add(Precipitation, {
  name: 'precipitation',
  row: 1,
  scaleName: 'asd',
  data: {
    solid: [
      [
        {
          day: 1,
          value: 0,
        },
        {
          day: 30,
          value: [
            {
              hour: 1,
              value: 10,
            },
            {
              hour: 2,
              value: 5,
            },
            {
              hour: 3,
              value: 15,
            },
            {
              hour: 4,
              value: 20,
            },
            {
              hour: 5,
              value: 10,
            },
            {
              hour: 6,
              value: 35,
            },
            {
              hour: 7,
              value: 18,
            },
            {
              hour: 8,
              value: 7,
            },
          ],
        },
      ],
    ],
    liquid: [
      [
        {
          day: 4,
          value: 10,
        },
        {
          day: 8,
          value: 25,
        },
      ],
      [
        {
          day: 4,
          value: 10,
        },
        {
          day: 8,
          value: 25,
        },
      ],
    ],
  },
})
