import { ComplexGraph } from './core/ComplexGraph'
import { AirTemperature } from './graphs/AirTemperature'
import { Precipitation } from './graphs/Precipitation'
import { WaterLevel } from './graphs/WaterLevel'
import { WaterСonsumption } from './graphs/WaterСonsumption'
import { Content } from './objects/Content'
import { Phase } from './objects/Phase'
import { Scrollbar } from './objects/Scrollbar'
import { Timeline } from './objects/Timeline'

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

cg.add(new Content())
cg.add(
  new Phase({
    start: {
      month: 1,
    },
    end: {
      month: 2,
      day: 15,
    },
    fontColor: '#C08C50',
    backgroundColor: '#FEFFD7',
    name: 'Открытое русло',
    shortName: 'ОР',
  })
)
cg.add(
  new Phase({
    start: {
      month: 2,
      day: 15,
    },
    end: {
      month: 3,
    },
    fontColor: '#C86546',
    backgroundColor: '#FBE9DD',
    name: 'Полное название',
    shortName: 'ОПП',
  })
)
cg.add(
  new Phase({
    start: {
      month: 3,
    },
    end: {
      month: 7,
    },
    fontColor: '#243372',
    backgroundColor: '#D5F2FA',
    name: 'Ледостав',
    shortName: 'ЛД',
  })
)
cg.add(
  new Phase({
    start: {
      month: 7,
    },
    end: {
      month: 7,
      day: 10,
    },
    fontColor: '#2F7B3A',
    backgroundColor: '#E0FFDF',
    name: 'Полное название',
    shortName: 'ВПП',
  })
)
cg.add(
  new Phase({
    start: {
      month: 7,
      day: 10,
    },
    end: {
      month: 7,
      day: 15,
    },
    fontColor: '#243372',
    backgroundColor: '#D5F2FA',
    name: 'Ледостав',
    shortName: 'ЛД',
  })
)
cg.add(
  new Phase({
    start: {
      month: 7,
      day: 15,
    },
    end: {
      month: 8,
    },
    fontColor: '#2F7B3A',
    backgroundColor: '#E0FFDF',
    name: 'Полное название',
    shortName: 'ВПП',
  })
)
cg.add(
  new Phase({
    start: {
      month: 8,
    },
    end: {
      month: 13,
      day: 31,
      fill: true,
    },
    fontColor: '#C08C50',
    backgroundColor: '#FEFFD7',
    name: 'Открытое русло',
    shortName: 'ОР',
  })
)
cg.add(new Timeline())
cg.add(new Scrollbar())

cg.add(
  new AirTemperature({
    name: 'airTemperature',
    row: 0,
    scaleTitle: 't воздуха °C',
    data: {
      min: [
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 10,
          },
        ],
      ],
      middle: [
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
        [
          {
            day: 1,
            value: -5,
          },
          {
            day: 25,
            value: 5,
          },
        ],
      ],
      max: [
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
          },
        ],
        [
          {
            day: 1,
            value: -10,
          },
          {
            day: 25,
            value: 20,
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
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
          },
          {
            day: 2,
            value: 15,
          },
        ],
        [
          {
            day: 1,
            value: [
              { hour: 1, value: 1 },
              { hour: 2, value: 2 },
              { hour: 3, value: 3 },
              { hour: 4, value: 4 },
              { hour: 5, value: 5 },
              { hour: 20, value: 15 },
              { hour: 23, value: 25 },
            ],
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
            day: 31,
            value: 15,
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
