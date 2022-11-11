import { ComplexGraph } from './core/ComplexGraph'
import { AirTemperature } from './graphs/AirTemperature'
import { Precipitation } from './graphs/Precipitation'
import { WaterLevel } from './graphs/WaterLevel'
import { WaterСonsumption } from './graphs/WaterСonsumption'

// --- TEST

const container = document.createElement('div')

container.style.cssText = `
  width: 100%;
  height: 100%;
`

document.getElementById('graph')?.appendChild(container)

const cg = new ComplexGraph({
  container,
  rows: [2, 1, 1, 3],
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

cg.add(
  new AirTemperature({
    name: 'airTemperature',
    row: 0,
    scaleTitle: 't воздуха °C',
    data: {
      default: [
        [
          {
            day: 1,
            value: -20,
          },
          {
            day: 31,
            value: 25,
          },
        ],
      ],
    },
  })
)

cg.add(
  new Precipitation({
    name: 'precipitation',
    row: 1,
    scaleTitle: 'Осадки, мм',
    data: {
      liquid: [
        [
          {
            day: 1,
            value: 10,
          },
          {
            day: 2,
            value: 15,
          },
        ],
      ],
      solid: [
        [
          {
            day: 3,
            value: 15,
          },
          {
            day: 4,
            value: 25,
          },
          {
            day: 31,
            value: 25,
          },
        ],
      ],
    },
  })
)

cg.add(
  new WaterLevel({
    name: 'waterlevel',
    row: 3,
    scaleTitle: 'Ур. воды, см',
    scaleStep: 50,
    data: {
      default: [
        [
          {
            day: 1,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: 30,
          },
        ],
        [
          {
            day: 1,
            value: 40,
          },
        ],
        [
          {
            day: 1,
            value: 30,
          },
        ],
        [
          {
            day: 1,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: 50,
          },
        ],
        [
          {
            day: 1,
            value: 100,
          },
        ],
        [
          {
            day: 1,
            value: 160,
          },
        ],
        [
          {
            day: 1,
            value: 250,
          },
        ],
        [
          {
            day: 1,
            value: 100,
          },
        ],
        [
          {
            day: 1,
            value: 200,
          },
        ],
      ],
    },
  })
)

cg.add(
  new WaterСonsumption({
    name: 'waterСonsumption',
    row: 3,
    scaleTitle: 'Расход м / c',
    scalePosition: 'right',
    scaleStep: 50,
    data: {
      qh: [
        [
          {
            day: 1,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: 30,
          },
        ],
        [
          {
            day: 1,
            value: 40,
          },
        ],
        [
          {
            day: 1,
            value: 30,
          },
        ],
        [
          {
            day: 1,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: 50,
          },
        ],
        [
          {
            day: 1,
            value: 100,
          },
        ],
        [
          {
            day: 1,
            value: 160,
          },
        ],
        [
          {
            day: 1,
            value: 44,
          },
        ],
        [
          {
            day: 1,
            value: 22,
          },
        ],
        [
          {
            day: 1,
            value: 70,
          },
        ],
      ],
      measured: [
        [
          {
            day: 13,
            value: 10,
          },
        ],
        [
          {
            day: 12,
            value: 20,
          },
        ],
        [
          {
            day: 22,
            value: 30,
          },
        ],
        [
          {
            day: 3,
            value: 40,
          },
        ],
        [
          {
            day: 26,
            value: 30,
          },
        ],
        [
          {
            day: 14,
            value: 10,
          },
        ],
        [
          {
            day: 16,
            value: 20,
          },
        ],
        [
          {
            day: 22,
            value: 50,
          },
        ],
        [
          {
            day: 12,
            value: 100,
          },
        ],
        [
          {
            day: 17,
            value: 160,
          },
        ],
        [
          {
            day: 19,
            value: 44,
          },
        ],
        [
          {
            day: 5,
            value: 22,
          },
        ],
        [
          {
            day: 1,
            value: 70,
          },
        ],
      ],
    },
  })
)
